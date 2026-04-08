
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
var edm_back;
var spritesheet, spriteData, bullet;
var runnerSheet, runnerData

let enemies = [];

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

    // Player 
    spritesheet = loadImage('../Assets/Player/red_guy_sheet.png');
    spriteData = loadJSON('../Assets/Player/redguy.json')
    bullet = loadImage('../Assets/Projectiles/bullet.png')

    // Enemey
    runnerSheet = loadImage('../Assets/Enemies/vinyl_runner.png')
    runnerData = loadJSON('../Assets/Enemies/vinyl_runner.json')
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
        default:
            break;
    }
    // If the game is paused, draw pause menu overtop the game
    if (levelRender != 'menu' && paused) {
        pauseMenuDraw();
    }
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
    if (levelName == 'edm') { // edm level
        edmSetup();
    }
    playLevelMusic();
}

function keyPressed() {
    pressedKeys[key] = true;
    if (key === 'c') { // added for testing
        switchLevel('edm');
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
    if (levelRender != "menu") {
        projectiles.push(new Projectile(player_1.x, player_1.y, mouseX, mouseY, "player"));
    }
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
        default:
            levelMusic = menuMusic;
            break;
    }
    levelMusic.play();
    levelMusic.setVolume(0.3); // change the volume between 0.0 and 1.0 if needed
    userStartAudio();
}
