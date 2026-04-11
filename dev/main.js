
/*
======================================
---------- Game Variables ------------
======================================
*/

// Variable for keeping track of the game state (level)
// Possible States
// 0 = menu
// 1 = lofi
// 2 = edm
// 3 = rock
// 4 = trans
let levelRender = 'menu'; 

// Variable to detect if the game is paused
let paused = false;

// Set Screen size
const CANVAS_HEIGHT = 1500 / 2;
const CANVAS_WIDTH = 2000 / 2;

// p5 sound object for playing in-game music
// See: https://p5js.org/reference/p5.sound/
let levelMusic;

// Assets loaded in preload()
var menuBacking, menuMusic, menuLargeBg, menuStartButton;
var menuSettingsButton, menuHowToButton, menuStoryButton, menuArcadeButton, menuChaoButton, menuLogoGlow;
var metal_back, rockMusic;
var edm_back, edmMusic;
var lofi_back, lofiMusic;
var spritesheet, spriteData, bullet, bulletData;
var runnerSheet, runnerData; // Edm grunt
var big_bassSheet, big_bassData; // Edm Bomber
var fireballSheet, fireballData; // Fireball projectiles

let enemies = [];

/** Shared fire rate for mouse and gamepad (ms between shots). */
const PLAYER_FIRE_INTERVAL_MS = 150;
let lastPlayerFireAt = 0;

/*
======================================
---------- p5.js core functions ------
======================================
*/

// Pre-load ALL game assets
function preload() {
    // Main menu
    menuBacking = loadImage('../Assets/GUI/menu_lava.png');
    menuMusic = loadSound('../Assets/Music/Fire_Ah_PlaceHolder.mp3'); // change file path when we have the actual menu music
    menuLargeBg = loadImage('../Assets/GUI/menu_background.png');
    menuStartButton = [loadImage('../Assets/Buttons/start.png'), loadImage('../Assets/Buttons/start_select.png')];
    menuSettingsButton = [loadImage('../Assets/Buttons/settings.png'), loadImage('../Assets/Buttons/settings_select.png')];
    menuHowToButton = [loadImage('../Assets/Buttons/how_to_play.png'), loadImage('../Assets/Buttons/how_to_play_select.png')];
    menuStoryButton = [loadImage('../Assets/Buttons/story.png'), loadImage('../Assets/Buttons/story_select.png')];
    menuArcadeButton = [loadImage('../Assets/Buttons/arcade.png'), loadImage('../Assets/Buttons/arcade_select.png')];
    menuChaoButton = [loadImage('../Assets/Buttons/chao.png'), loadImage('../Assets/Buttons/chao_select.png')];
    menuLogoGlow = loadImage('../Assets/GUI/logo_glow.png');

    // Metal level
    metal_back = loadImage('../Assets/Levels/Test_Level_Lava.png');
    rockMusic = loadSound('../Assets/Music/Terrible_Placeholder_Music.mp3');

    // EDM level
    edm_back = loadImage('../Assets/Levels/test_level_edm.png');
    edmMusic = loadSound('../Assets/Music/ContraAhSng.mp3');

    // Lofi level
    lofi_back = loadImage('../Assets/Levels/test_level_lofi.png')
    lofiMusic = loadSound('../Assets/Music/PoopMusic.mp3');

    // Player 
    spritesheet = loadImage('../Assets/Player/red_guy_sheet.png');
    spriteData = loadJSON('../Assets/Player/redguy.json')
    bullet = loadImage('../Assets/Projectiles/bullet.png')
    bulletData = loadJSON('../Assets/Projectiles/bullet.json')

    // Enemey
    runnerSheet = loadImage('../Assets/Enemies/vinyl_runner.png');
    runnerData = loadJSON('../Assets/Enemies/vinyl_runner.json');
    big_bassSheet = loadImage('../Assets/Enemies/big_bass.png');
    big_bassData = loadJSON('../Assets/Enemies/big_bass.json');
    fireballSheet = loadImage('../Assets/Projectiles/fireball.png')
    fireballData = loadJSON('../Assets/Projectiles/fireball.json')
}

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    noSmooth();
    playLevelMusic();
}

function draw() {
    if (!paused && typeof updateGamepads === "function") {
        updateGamepads();
    }
    if (!paused) {
        handleHeldFire();
    }
    switch (levelRender) {
        case 'menu':
            menuDraw();
            break;
        case 'rock':
            rockDraw();
            break;
        case 'edm':
            edmDraw();
            break;
        case 'lofi':
            lofiDraw();
        default:
            break;
    }
    // If the game is paused, draw pause menu overtop the game
    if (levelRender != 'menu' && paused) {
        pauseMenuDraw();
    }

    // FPS Counter 
    fpsCounter();
}


/*
======================================
------- Function Declarations --------
======================================
*/

/**
 * Switches current level and re-freshes the music
 */
function switchLevel(levelName) {
    levelRender = levelName;
    if (levelName === 'rock') {
        rockSetup();
    }
    if (levelName === 'edm') { // edm level
        edmSetup();
    }
    if (levelName === 'lofi') {
        lofiSetup();
    }
    playLevelMusic();
}

function keyPressed() {
    pressedKeys[key] = true;
    if (key === 'c') { // added for testing
        switchLevel('edm');
    }
    if (key === 'v') { // added for testing
        switchLevel('lofi');
    }
    if (key == 'Escape' && levelRender != 'menu') {
        // Toggle pausing variable
       paused = !paused; 
    }
}

function keyReleased() {
    pressedKeys[key] = false;
}

function mousePressed() {
    if (paused) {
        return;
    }
    tryFireMouseProjectile();
}

function handleHeldFire() {
    if (mouseIsPressed) {
        tryFireMouseProjectile();
    }
}

function tryFireMouseProjectile() {
    if (levelRender === "menu") {
        return;
    }
    if (typeof player_1 === "undefined" || !player_1 || typeof projectiles === "undefined") {
        return;
    }

    const now = millis();
    if (now - lastPlayerFireAt < PLAYER_FIRE_INTERVAL_MS) {
        return;
    }

    projectiles.push(new Projectile(player_1.x, player_1.y, mouseX, mouseY, "player"));
    lastPlayerFireAt = now;
}

/**
 * Plays the music track for the appropriate level (or main menu).
 */
function playLevelMusic() {
    if (levelMusic != undefined)
        levelMusic.stop();
    switch (levelRender) {
        case 'menu':
            levelMusic = menuMusic;
            break;
        case 'rock':
            levelMusic = rockMusic;
            break;
        case 'edm':
            levelMusic = edmMusic;
            break;
        case 'lofi':
            levelMusic = lofiMusic;
            break;
        default:
            levelMusic = menuMusic;
            break;
    }
    levelMusic.play();
    levelMusic.setVolume(0.3); // change the volume between 0.0 and 1.0 if needed
    userStartAudio();
}

/**
 * LLM-Generated FPS Counter
 * Tracks the number of frames drawn every second
 * https://p5js.org/reference/p5/frameRate/
 */
function fpsCounter() {
    let currentFps = frameRate(); // Get the current framerate from p5.js
    
    push(); // Save current drawing style settings
    
    // Styling for the FPS text
    fill(0, 255, 0); // Bright green text
    noStroke();
    textSize(20);
    textAlign(LEFT, TOP);
    textFont('Courier New'); // Monospace font keeps the text from jittering width-wise
    
    // Draw the text in the top-left corner
    // .toFixed(1) rounds the number to 1 decimal place (e.g., 60.0)
    text(currentFps.toFixed(1), 10, 10); 
    
    pop(); // Restore previous drawing style settings so we don't mess up other renders
}