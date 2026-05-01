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
// 5 = tutorial
let levelRender = 'menu'; 
let game_mode = 'story';

// Variable to detect if the game is paused
let paused = false;

// Variable to track if game is over
let gameOver = false;
let gameOverMusicPlaying = false;
let gameOverMouseLock = false;

// Tutorial variables
let tutorialIndex = 0;
let tutorialClickFlag = false;
let tutorialMusicPlaying = false;
let showTutorialOverlay = false;
var tutorialImages = []; // Array to hold tutorial images

// End screen variables
let endMusicPlaying = false;
let endScreenMouseLock = false;

// Set Screen size
const CANVAS_HEIGHT = 1500 / 2;
const CANVAS_WIDTH = 2000 / 2;

// p5 sound object for playing in-game music
// See: https://p5js.org/reference/p5.sound/
let levelMusic;
// Game Sound Volumes
let sfx_volume = 0.3;
let music_volume = 0.3;

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
var settingsIconSheet, settingsIconData; // In-game gear/settings button (sprite sheet)
var gameOverImage; // Game over screen image
var gameOverMusic; // Game over music
var tutorialMusic; // Tutorial background music
var endScene, endScenePlayer;
var exitItem, healthBox;
var rollJSON, rollspritesheet;

let enemies = [];
let boss = [];
let items = [];

/** Shared fire rate for mouse and gamepad (ms between shots). */
const PLAYER_FIRE_INTERVAL_MS = 150;
let lastPlayerFireAt = 0;
let laserCooldown = 0;
const LASER_DURATION = 60; 
let firePending = false;

/** In-game settings (gear) button state. */
const IN_GAME_SETTINGS_BTN_X = 15;
const IN_GAME_SETTINGS_BTN_Y = 15;
const IN_GAME_SETTINGS_BTN_SIZE = 50;
let inGameSettingsClickLock = false;
let inGameSettingsHovered = false;

/*
======================================
---------- p5.js core functions ------
======================================
*/

// Pre-load ALL game assets
function preload() {
    // Main menu
    menuBacking = loadImage('../Assets/GUI/menu_lava.png');
    menuMusic = loadSound('../Assets/Music/RythemizerThemeExtended.mp3'); // change file path when we have the actual menu music
    menuLargeBg = loadImage('../Assets/GUI/menu_background.png');
    menuStartButton = [loadImage('../Assets/Buttons/start.png'), loadImage('../Assets/Buttons/start_select.png')];
    menuSettingsButton = [loadImage('../Assets/Buttons/settings.png'), loadImage('../Assets/Buttons/settings_select.png')];
    menuHowToButton = [loadImage('../Assets/Buttons/how_to_play.png'), loadImage('../Assets/Buttons/how_to_play_select.png')];
    menuStoryButton = [loadImage('../Assets/Buttons/story.png'), loadImage('../Assets/Buttons/story_select.png')];
    menuArcadeButton = [loadImage('../Assets/Buttons/arcade.png'), loadImage('../Assets/Buttons/arcade_select.png')];
    menuChaoButton = [loadImage('../Assets/Buttons/chao.png'), loadImage('../Assets/Buttons/chao_select.png')];
    returnMenuButton = [loadImage('../Assets/Buttons/main_menu.png'), loadImage('../Assets/Buttons/main_menu_select.png')];
    menuResumeButton = [loadImage('../Assets/Buttons/resume.png'), loadImage('../Assets/Buttons/resume_select.png')];
    menuLogoGlow = loadImage('../Assets/GUI/logo_glow.png');
    
    

    // Metal level
    metal_back = loadImage('../Assets/Levels/Test_Level_Lava.png');
    rockMusic = loadSound('../Assets/Music/Organica - Master of None.mp3');
    dragonJSON = loadJSON('../Assets/Bosses/guitar_dragon_boss.json');
    dragonSpriteSheet = loadImage('../Assets/Bosses/guitar_dragon_boss.png');

    // EDM level
    edm_back = loadImage('../Assets/Levels/test_level_edm.png');
    edmMusic = loadSound('../Assets/Music/Game_Audio.wav');
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
    rollJSON = loadJSON('../Assets/Player/roll_anim.json')
    rollspritesheet = loadImage('../Assets/Player/roll_anim.png')

    // Player Bullets
    bullet = loadImage('../Assets/Projectiles/bullet.png');
    bulletData = loadJSON('../Assets/Projectiles/bullet.json');
    fastBullet = loadImage('../Assets/Projectiles/fast_bullet.png');
    fastBulletData = loadJSON('../Assets/Projectiles/fast_bullet.json');
    laserPink = loadImage('../Assets/Projectiles/laser_pink.png');
    laserPinkData = loadJSON('../Assets/Projectiles/laser_pink.json');
    vinylGreen = loadImage('../Assets/Projectiles/vinyl_green_sheet.png');
    vinylGreenData = loadJSON('../Assets/Projectiles/vinyl_green.json');
    vinylPink = loadImage('../Assets/Projectiles/vinyl_pink_sheet.png');
    vinylPinkData = loadJSON('../Assets/Projectiles/vinyl_pink.json');
    vinylBlue = loadImage('../Assets/Projectiles/vinyl_blue_sheet.png');
    vinylBlueData = loadJSON('../Assets/Projectiles/vinyl_blue.json');

    // End Screen
    endScene = loadImage('../Assets/GUI/end_scene-faster.gif');
    endScenePlayer = loadImage('../Assets/GUI/end_scene_player-faster.gif');

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
    // Cat Rider
    cat_riderSheet = loadImage('../Assets/Enemies/cat_waverider.png');
    cat_riderData = loadJSON('../Assets/Enemies/cat_waverider.json');
    // Pedal Floater
    pedal_floaterSheet = loadImage('../Assets/Enemies/pedal_floater.png');
    pedal_floaterData = loadJSON('../Assets/Enemies/pedal_floater.json');
    // ---------------------

    // Enemy Projectiles
    fireballSheet = loadImage('../Assets/Projectiles/fireball.png');
    fireballData = loadJSON('../Assets/Projectiles/fireball.json');
    quarterNote = loadImage('../Assets/Projectiles/quarter_note.png');
    hypnoWaveSheet = loadImage('../Assets/Projectiles/hypno_wave.png');

    // Elemental explosion
    eleExplodeSprite = loadImage('../Assets/element_explosion.png');
    eleExplodeData = loadJSON('../Assets/element_explosion.json'); 
    
    //Fire explosion
    fireExplodeSprite = loadImage('../Assets/fire_explosion.png');
    fireExplodeData = loadJSON('../Assets/fire_explosion.json');

    // Guns
    pistolSprite = loadImage('../Assets/Weapons/pistol.png')
    laserSprite = loadImage('../Assets/Weapons/beat_laser.png')
    discThrowerSprite = loadImage('../Assets/Weapons/disc_thrower.png')
    shotgunSprite = loadImage('../Assets/Weapons/shotgun.png')

    // Shield
    shieldSheet = loadImage('../Assets/Player/shield.png')
    shieldData = loadJSON('../Assets/Player/shield.json')
    
    // Health Bar
    healthBarSheet = loadImage('../Assets/GUI/health_bar.png');
    healthBarData = loadJSON('../Assets/GUI/health_bar.json');

    // In-game settings (gear) button
    settingsIconSheet = loadImage('../Assets/GUI/setting.png');
    settingsIconData = loadJSON('../Assets/GUI/setting.json');
    
    // Game Over
    gameOverImage = loadImage('../Assets/GUI/death_screen.png');
    gameOverMusic = loadSound('../Assets/Music/29_Ghosts_IV.mp3');

    // Items
    healthBox = loadImage('../Assets/Items/health_box.png');
    shieldBox = loadImage('../Assets/Items/shield_box.png');
    shotgunBox = loadImage('../Assets/Items/shotgun_box.png');
    laserBox = loadImage('../Assets/Items/laser_box.png');
    vinylBox = loadImage('../Assets/Items/disc_shooter_box.png');
    exitItem = loadImage('../Assets/Items/end_story_item.png');
    
    // Tutorial images
    tutorialImages[0] = loadImage('../Assets/GUI/tutorial_1.png');
    tutorialImages[1] = loadImage('../Assets/GUI/tutorial_2.png');
    tutorialImages[2] = loadImage('../Assets/GUI/tutorial_3.png');
    
    // End screen gifs
    playerWalking = loadImage('../Assets/GUI/player_walking.gif');
    endScene = loadImage('../Assets/GUI/end_scene.gif');
    endScenePlayer = loadImage('../Assets/GUI/end_scene_player.gif');

    // Tutorial music
    tutorialMusic = loadSound('../Assets/Music/The_Four_(five)_Of_Us_Are_dying.mp3');

    // --------------SFX---------------
    explosionNormal = loadSound('../Assets/SFX/sfx_explosionNormal.ogg');
    healthSFX = loadSound('../Assets/SFX/sfx_health.ogg');
    shockedSFX = loadSound('../Assets/SFX/sfx_shocked.ogg'); 
    waveClearSFX = loadSound('../Assets/SFX/sfx_waveclear.ogg');
    selectSFX = loadSound('../Assets/SFX/sfx_select.ogg');
    toggleSFX = loadSound('../Assets/SFX/sfx_toggle.ogg');
}

function setup() {
    const cnv = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    // Move the p5 canvas into our flex-centered, letterboxed wrapper.
    cnv.parent('game-container');
    noSmooth();
    fitCanvasToWindow();
    playLevelMusic();
}

/**
 * p5.js callback fired whenever the browser window changes size.
 * We deliberately do NOT call resizeCanvas() here — the drawing buffer
 * (and therefore all game coordinates / physics) must stay at the fixed
 * virtual resolution CANVAS_WIDTH x CANVAS_HEIGHT. Only the on-screen
 * display size changes.
 */
function windowResized() {
    fitCanvasToWindow();
}

/**
 * Scales the canvas's CSS display size so it fits inside the browser
 * window while preserving the game's aspect ratio (uniform scale, no
 * distortion, no cropping). Using Math.min picks the largest scale that
 * still keeps the whole 1000x750 game visible — the unused space on the
 * short side of the window shows through as black letterbox / pillarbox
 * bars from the #game-container background.
 *
 * Game logic is unaffected: createCanvas() still uses the fixed virtual
 * resolution CANVAS_WIDTH x CANVAS_HEIGHT, so all coordinates, physics,
 * and asset positions stay the same.
 *
 * Why CSS width/height instead of `transform: scale()`?
 *   p5.js translates browser mouse positions to canvas-space using
 *   `canvas.scrollWidth / canvas.width` (and the matching height ratio).
 *   CSS transforms do NOT update scrollWidth, so a transform-based scale
 *   would leave mouseX / mouseY reporting raw screen pixels and break
 *   every click target in the game. Setting style.width / style.height
 *   is the canonical p5 approach and keeps mouseX / mouseY in virtual
 *   game coordinates with zero changes to game logic.
 */
function fitCanvasToWindow() {
    const cnvElt = (typeof drawingContext !== 'undefined' && drawingContext && drawingContext.canvas)
        ? drawingContext.canvas
        : document.querySelector('#game-container canvas');
    if (!cnvElt) {
        return;
    }

    const scale = Math.min(
        window.innerWidth / CANVAS_WIDTH,
        window.innerHeight / CANVAS_HEIGHT
    );

    const displayWidth = Math.floor(CANVAS_WIDTH * scale);
    const displayHeight = Math.floor(CANVAS_HEIGHT * scale);

    cnvElt.style.width = displayWidth + 'px';
    cnvElt.style.height = displayHeight + 'px';
}

function draw() {
    if (gameOver) {
        boss_spawned = false;
        edm_boss_spawned = false;
        lofi_boss_spawned = false;
        projectiles = [];
        is_dead = true;
        displayGameOver();
        return;
    }
    
    if (!paused && typeof updateGamepads === "function") {
        updateGamepads();
    }
    if (!paused) {
        handleHeldFire();
        if (laserCooldown > 0) laserCooldown--;
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
            break;
        case 'end':
            endScreenDraw();
            break
        case 'tutorial':
            displayTutorial();
            break;
        default:
            break;
    }
    // In-game settings button (top-left). Only show during gameplay levels and when
    // the pause menu isn't already up, so it doesn't draw over the pause UI.
    if (isGameplayLevel(levelRender) && !paused) {
        drawInGameSettingsButton();
    } else {
        inGameSettingsHovered = false;
    }

    // If the game is paused, draw pause menu overtop the game
    if (levelRender != 'menu' && paused) {
    pauseMenuDraw();
    if (showTutorialOverlay) {
        displayTutorial();
        }
    }

    // FPS Counter 
    //fpsCounter();
}

/**
 * Returns true when the current level is an active gameplay level
 * (so we can decide whether to show the in-game settings button).
 */
function isGameplayLevel(level) {
    return level === 'rock' || level === 'edm' || level === 'lofi';
}

/**
 * Draws the gear icon button at the top-left of the screen during gameplay.
 * Clicking it pauses the game, which causes pauseMenuDraw() to render the pause menu.
 */
function drawInGameSettingsButton() {
    if (typeof settingsIconSheet === "undefined" || !settingsIconSheet ||
        typeof settingsIconData === "undefined" || !settingsIconData) {
        return;
    }

    const x = IN_GAME_SETTINGS_BTN_X;
    const y = IN_GAME_SETTINGS_BTN_Y;
    const size = IN_GAME_SETTINGS_BTN_SIZE;

    const hovering =
        mouseX >= x && mouseX <= x + size &&
        mouseY >= y && mouseY <= y + size;

    // Hover SFX (only fire once when entering the button)
    if (hovering && !inGameSettingsHovered) {
        if (typeof playSFX === "function") {
            playSFX("hover");
        }
    }
    inGameSettingsHovered = hovering;

    // Pick a sprite frame: idle vs hovered/pressed.
    const frames = settingsIconData.frames;
    let frameIndex = 0;
    if (hovering) {
        frameIndex = mouseIsPressed ? 2 : 1;
    }
    if (frameIndex >= frames.length) {
        frameIndex = frames.length - 1;
    }
    const frame = frames[frameIndex].position;

    push();
    imageMode(CORNER);
    image(
        settingsIconSheet,
        x, y,
        size, size,
        frame.x, frame.y,
        frame.w, frame.h
    );
    pop();

    // Click to open the pause menu.
    if (hovering && mouseIsPressed && !inGameSettingsClickLock) {
        inGameSettingsClickLock = true;
        if (typeof playSFX === "function") {
            playSFX("click");
        }
        paused = true;
    }
    if (!mouseIsPressed) {
        inGameSettingsClickLock = false;
    }
}

/** True when the mouse is over the in-game settings button hitbox. */
function isMouseOverInGameSettingsButton() {
    const x = IN_GAME_SETTINGS_BTN_X;
    const y = IN_GAME_SETTINGS_BTN_Y;
    const size = IN_GAME_SETTINGS_BTN_SIZE;
    return mouseX >= x && mouseX <= x + size &&
           mouseY >= y && mouseY <= y + size;
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
    if (levelName === 'lofi') { // lofi level
        lofiSetup();
    }
    if (levelName === 'end') { // end screen 
        endScreenSetup();
    }
    playLevelMusic();
}

function keyPressed() {
    pressedKeys[key] = true;
    if (typeof showSettings !== "undefined" && showSettings && key === "Escape") {
        showSettings = false;
        return;
    }
    if (key === 'c') { // added for testing
        switchLevel('end');
    }
    if (key === 'v') { // added for testing
        switchLevel('rock');
    }
    if (key === 'e') { // added for testing
        switchLevel('edm');
    }
    if (key == 'Escape' && levelRender != 'menu') {
        // Toggle pausing variable
        if (showTutorialOverlay) {
            return
        };
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
    // Don't fire when the player is clicking the in-game settings (gear) button.
    if (isMouseOverInGameSettingsButton()) {
        return;
    }

    const now = millis();
    if (now - lastPlayerFireAt < PLAYER_FIRE_INTERVAL_MS) return;
    if (weapon == 2 && laserCooldown > 0) return;

    lastPlayerFireAt = now;
    if (weapon == 2) laserCooldown = LASER_DURATION;

    // Signal to the level that a shot was fired
    firePending = true;
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
        case 'end':
            levelMusic = edmMusic; // change this to end level music when added
            break;
        case 'tutorial':
            levelMusic = tutorialMusic;
            break;
        default:
            levelMusic = menuMusic;
            break;
    }
    levelMusic.setVolume(music_volume); // change the volume between 0.0 and 1.0 if needed
    levelMusic.loop();
    levelMusic.play();
    userStartAudio();
}

/**
 * Applies global music_volume to every loaded music track so menu / tutorial / game over stay in sync.
 */
function applyMusicVolume() {
    if (typeof menuMusic !== "undefined" && menuMusic) {
        menuMusic.setVolume(music_volume);
    }
    if (typeof levelMusic !== "undefined" && levelMusic) {
        levelMusic.setVolume(music_volume);
    }
    if (typeof tutorialMusic !== "undefined" && tutorialMusic) {
        tutorialMusic.setVolume(music_volume);
    }
    if (typeof gameOverMusic !== "undefined" && gameOverMusic) {
        gameOverMusic.setVolume(music_volume);
    }
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
let healthIndex;
function displayHealthBar(player) {
    if (typeof player === "undefined" || !player || typeof healthBarData === "undefined") {
        return;
    }
    
    healthIndex = Math.max(0, Math.min(5, 5 - player.health));

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
            gameOverMusic.setVolume(music_volume);
        }
    }
    
    if (typeof gameOverImage === "undefined" || !gameOverImage) {
        fill(0);
        rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        fill(255);
        textSize(48);
        textAlign(CENTER, CENTER);
        text("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        drawArcadeWavesSurvivedOverlay();
        drawGameOverMainMenuButton();
        return;
    }
    image(gameOverImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawArcadeWavesSurvivedOverlay();
    drawGameOverMainMenuButton();
}

/**
 * Arcade rock level: show how many waves were cleared before death.
 */
function drawArcadeWavesSurvivedOverlay() {
    if (game_mode !== "arcade" || levelRender !== "rock") {
        return;
    }
    if (typeof arcade_waves_survived === "undefined") {
        return;
    }
    push();
    textAlign(CENTER, CENTER);
    textSize(28);
    const x = CANVAS_WIDTH / 2;
    const y = CANVAS_HEIGHT / 2 + 55;
    fill(0, 0, 0, 200);
    text(`Waves survived: ${arcade_waves_survived}`, x + 2, y + 2);
    fill(255, 230, 120);
    text(`Waves survived: ${arcade_waves_survived}`, x, y);
    pop();
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
            if (showTutorialOverlay) {
                showTutorialOverlay = false; // ← just hide the overlay, pause menu stays
            } else {
                levelRender = "menu";
                playLevelMusic();
            }
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

/**
 * main menu button on death screen
 */
function drawGameOverMainMenuButton() {
  const w = 240;
  const h = 60;
  const x = CANVAS_WIDTH / 2;
  const y = CANVAS_HEIGHT - 35;

  imageMode(CENTER);
  image(returnMenuButton[0], x, y, w, h);

  if (isHovering("gameover_menu", x, y, w, h)) {
    image(returnMenuButton[1], x, y, w, h);

    if (mouseIsPressed && !gameOverMouseLock) {
      gameOverMouseLock = true;
      playSFX("click");

      gameOver = false;
      gameOverMusicPlaying = false;
      if (gameOverMusic) gameOverMusic.stop();
      levelRender = 'menu';
      playLevelMusic();
    }
  }

  if (!mouseIsPressed) {
    gameOverMouseLock = false;
  }

  imageMode(CORNER);
}

/**
 * main menu button on end screen
 */
function drawEndScreenMainMenuButton() {
  const w = 240;
  const h = 60;
  const x = CANVAS_WIDTH / 2;
  const y = CANVAS_HEIGHT - 35;

  imageMode(CENTER);
  image(returnMenuButton[0], x, y, w, h);

  if (isHovering("gameover_menu", x, y, w, h)) {
    image(returnMenuButton[1], x, y, w, h);

    if (mouseIsPressed && !endScreenMouseLock) {
      endScreenMouseLock = true;
      playSFX("click");

      levelRender = 'menu';
      playLevelMusic();
    }
  }

  if (!mouseIsPressed) {
    endScreenMouseLock = false;
  }

  imageMode(CORNER);
}

// Source - https://stackoverflow.com/a/39914235
// Posted by Dan Dascalescu, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-15, License - CC BY-SA 4.0
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}