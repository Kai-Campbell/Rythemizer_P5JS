
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

// Variable to track if game is over
let gameOver = false;
let gameOverMusicPlaying = false;

// Tutorial variables
let showTutorial = false;
let tutorialIndex = 0;
let tutorialClickFlag = false;
let tutorialMusicPlaying = false;
var tutorialImages = []; // Array to hold tutorial images

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
var amp_smallSheet, amp_smallData // amp enemy
var disc_throwerData, disc_throwerSheet // disc enemy
var fireballSheet, fireballData; // Fireball projectiles
var eleExplodeSprite, eleExplodeData; // Elemental explosion
var dragonSpriteSheet, dragonJSON // Dragon Boss 
var rave_knightJSON, rave_knightSheet // Rave Boss
var bard_JSON, bard_spriteSheet // Bard boss
var shotgunSprite
var healthBarSheet, healthBarData; // Health bar display
var gameOverImage; // Game over screen image
var gameOverMusic; // Game over music
var tutorialMusic; // Tutorial background music

let enemies = [];
let boss = [];

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
    rockMusic = loadSound('../Assets/Music/RockLevelMusic.mp3');
    dragonJSON = loadJSON('../Assets/Bosses/guitar_dragon_boss.json');
    dragonSpriteSheet = loadImage('../Assets/Bosses/guitar_dragon_boss.png');

    // EDM level
    edm_back = loadImage('../Assets/Levels/test_level_edm.png');
    edmMusic = loadSound('../Assets/Music/ContraAhSng.mp3');
    rave_knightJSON = loadJSON('../Assets/Bosses/rave_knight.json');
    rave_knightSheet = loadImage('../Assets/Bosses/rave_knight.png');

    // Lofi level
    lofi_back = loadImage('../Assets/Levels/test_level_lofi.png');
    lofiMusic = loadSound('../Assets/Music/PoopMusic.mp3');
    bard_JSON = loadJSON('../Assets/Bosses/vibe_bard.json');
    bard_spriteSheet = loadImage('../Assets/Bosses/vibe_bard.png');

    // Player 
    spritesheet = loadImage('../Assets/Player/red_guy_sheet.png');
    spriteData = loadJSON('../Assets/Player/redguy.json');
    bullet = loadImage('../Assets/Projectiles/bullet.png');
    bulletData = loadJSON('../Assets/Projectiles/bullet.json');

    // ------ Enemies ------ 
    // Runner
    runnerSheet = loadImage('../Assets/Enemies/vinyl_runner.png');
    runnerData = loadJSON('../Assets/Enemies/vinyl_runner.json');
    // Big Bass
    big_bassSheet = loadImage('../Assets/Enemies/big_bass.png');
    big_bassData = loadJSON('../Assets/Enemies/big_bass.json');
    // Disc Thrower
    disc_throwerSheet = loadImage('../Assets/Enemies/disc_thrower.png');
    disc_throwerData = loadJSON('../Assets/Enemies/disc_thrower.json');
    // Small Amp
    amp_smallSheet = loadImage('../Assets/Enemies/small_amp.png');
    amp_smallData = loadJSON('../Assets/Enemies/small_amp.json');
    // ---------------------

    // Fireball Projectile
    fireballSheet = loadImage('../Assets/Projectiles/fireball.png')
    fireballData = loadJSON('../Assets/Projectiles/fireball.json')

    // Elemental explosion
    eleExplodeSprite = loadImage('../Assets/element_explosion.png');
    eleExplodeData = loadJSON('../Assets/element_explosion.json');    

    // Guns
    shotgunSprite = loadImage('../Assets/Weapons/shotgun.png')
    
    // Health Bar
    healthBarSheet = loadImage('../Assets/GUI/health_bar.png');
    healthBarData = loadJSON('../Assets/GUI/health_bar.json');
    
    // Game Over
    gameOverImage = loadImage('../Assets/GUI/death_screen.png');
    gameOverMusic = loadSound('../Assets/Music/29_Ghosts_IV.mp3');
    
    // Tutorial images
    tutorialImages[0] = loadImage('../Assets/tutorial_1_placeholder.png');
    tutorialImages[1] = loadImage('../Assets/tutorial_2_placeholder.png');
    tutorialImages[2] = loadImage('../Assets/tutorial_3_placeholder.png');
    
    // Tutorial music
    tutorialMusic = loadSound('../Assets/Music/The_Four_(five)_Of_Us_Are_dying.mp3');
}

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    noSmooth();
    playLevelMusic();
}

function draw() {
    if (showTutorial) {
        // Handle music for tutorial entry
        if (!tutorialMusicPlaying) {
            tutorialMusicPlaying = true;
            if (levelMusic !== undefined) {
                levelMusic.stop();
            }
            if (tutorialMusic !== undefined) {
                tutorialMusic.loop();
                tutorialMusic.setVolume(0.3);
            }
        }
        displayTutorial();
        return;
    } else {
        // Handle music for tutorial exit
        if (tutorialMusicPlaying) {
            tutorialMusicPlaying = false;
            if (tutorialMusic !== undefined) {
                tutorialMusic.stop();
            }
            if (levelRender === 'menu' && menuMusic !== undefined) {
                menuMusic.play();
                menuMusic.setVolume(0.3);
            } else if (levelMusic !== undefined && levelRender !== 'menu') {
                levelMusic.play();
                levelMusic.setVolume(0.3);
            }
        }
    }
    
    if (gameOver) {
        displayGameOver();
        return;
    }
    
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

/**
 * Displays the health bar in the bottom left of the screen
 */
function displayHealthBar(player) {
    if (typeof player === "undefined" || !player || typeof healthBarData === "undefined") {
        return;
    }
    
    let healthIndex = Math.max(0, Math.min(5, 5 - player.health));

    let frame = healthBarData.frames[healthIndex].position;
    
    push();
    image(
        healthBarSheet,     
        20, height - 60,
        230, 40,
        frame.x, frame.y,
        frame.w, frame.h
    );
    pop();
}

/**
 * Displays the game over screen
 */
function displayGameOver() {
    // Stop all other music and play game over music
    if (!gameOverMusicPlaying) {
        gameOverMusicPlaying = true;
        if (levelMusic !== undefined) {
            levelMusic.stop();
        }
        if (tutorialMusic !== undefined) {
            tutorialMusic.stop();
        }
        if (menuMusic !== undefined) {
            menuMusic.stop();
        }
        if (gameOverMusic !== undefined) {
            gameOverMusic.loop();
            gameOverMusic.setVolume(0.3);
        }
    }
    
    if (typeof gameOverImage === "undefined" || !gameOverImage) {
        fill(0);
        rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        fill(255);
        textSize(48);
        textAlign(CENTER, CENTER);
        text("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        return;
    }
    image(gameOverImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

/**
 * Displays the tutorial images with navigation arrows
 */
function displayTutorial() {
    // Draw semi-transparent background
    fill(0, 0, 0, 200);
    rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Display current tutorial image with margins
    const margin = 40;
    const imgWidth = CANVAS_WIDTH - (margin * 2);
    const imgHeight = CANVAS_HEIGHT - (margin * 2) - 100; // Leave space for buttons
    const imgX = margin;
    const imgY = margin;
    
    if (tutorialImages[tutorialIndex]) {
        image(tutorialImages[tutorialIndex], imgX, imgY, imgWidth, imgHeight);
    }
    
    // Button dimensions and positions
    const buttonSize = 50;
    const buttonY = CANVAS_HEIGHT - 60;
    const leftArrowX = CANVAS_WIDTH / 2 - 80;
    const rightArrowX = CANVAS_WIDTH / 2 + 80;
    
    // Draw left arrow (always visible)
    if (tutorialIndex > 0) {
        drawLeftArrow(leftArrowX, buttonY, buttonSize);
        if (isHoveringButton(leftArrowX, buttonY, buttonSize) && mouseIsPressed && !tutorialClickFlag) {
            tutorialClickFlag = true;
            tutorialIndex--;
        }
    }
    
    // Draw right arrow or X
    if (tutorialIndex < tutorialImages.length - 1) {
        drawRightArrow(rightArrowX, buttonY, buttonSize);
        if (isHoveringButton(rightArrowX, buttonY, buttonSize) && mouseIsPressed && !tutorialClickFlag) {
            tutorialClickFlag = true;
            tutorialIndex++;
        }
    } else {
        drawExitX(rightArrowX, buttonY, buttonSize);
        if (isHoveringButton(rightArrowX, buttonY, buttonSize) && mouseIsPressed && !tutorialClickFlag) {
            tutorialClickFlag = true;
            showTutorial = false;
        }
    }
    
    // Reset click flag when mouse is released
    if (!mouseIsPressed) {
        tutorialClickFlag = false;
    }
}

/**
 * Helper function to check if mouse is hovering over a button
 */
function isHoveringButton(x, y, size) {
    return mouseX >= x - size/2 && mouseX <= x + size/2 &&
           mouseY >= y - size/2 && mouseY <= y + size/2;
}

/**
 * Draws a left arrow button
 */
function drawLeftArrow(x, y, size) {
    push();
    fill(100, 150, 255);
    stroke(255);
    strokeWeight(2);
    
    if (isHoveringButton(x, y, size)) {
        fill(150, 200, 255);
    }
    
    // Draws the arrow
    triangle(
        x + size/3, y - size/3,      // top point
        x - size/3, y,               // left point
        x + size/3, y + size/3       // bottom point
    );
    triangle(
        x + size/3, y - size/3,
        x + size/3, y + size/3,
        x + size/4, y
    );
    
    pop();
}

/**
 * Draws a right arrow button
 */
function drawRightArrow(x, y, size) {
    push();
    fill(100, 150, 255);
    stroke(255);
    strokeWeight(2);
    
    if (isHoveringButton(x, y, size)) {
        fill(150, 200, 255);
    }
    
    // Draws the arrow
    triangle(
        x - size/3, y - size/3,      // top point
        x + size/3, y,               // right point
        x - size/3, y + size/3       // bottom point
    );
    triangle(
        x - size/3, y - size/3,
        x - size/3, y + size/3,
        x - size/4, y
    );
    
    pop();
}

/**
 * Draws an X button to exit tutorial
 */
function drawExitX(x, y, size) {
    push();
    fill(255, 100, 100);
    stroke(255);
    strokeWeight(3);
    
    if (isHoveringButton(x, y, size)) {
        fill(255, 150, 150);
    }
    
    // Draw X
    line(x - size/3, y - size/3, x + size/3, y + size/3);
    line(x + size/3, y - size/3, x - size/3, y + size/3);
    
    pop();
}

// Source - https://stackoverflow.com/a/39914235
// Posted by Dan Dascalescu, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-15, License - CC BY-SA 4.0
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
