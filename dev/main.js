
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

// Screen size
const CANVAS_HEIGHT = 960;
const CANVAS_WIDTH = 540;

// p5 sound object for playing in-game music
// See: https://p5js.org/reference/p5.sound/
let levelMusic;

/*
======================================
---------- p5.js core functions ------
======================================
*/

// Pre-load ALL game assets
function preload() {
    // Main menu
    menuBacking = loadImage('../Assets/menu_lava.png');
    menuMusic = loadSound('../Assets/Music/Fire_Ah_PlaceHolder.mp3'); // change file path when we have the actual menu music
    menuLargeBg = loadImage('../Assets/menu_background.png');
    menuStartButton = [loadImage('../Assets/Buttons/start.png'), loadImage('../Assets/Buttons/start_select.png')];

    // Metal level
    metal_back = loadImage('../Assets/Test_Level_Lava.png');
    rockMusic = loadSound('../Assets/Music/Terrible_Placeholder_Music.mp3');

    spritesheet = loadImage('../Assets/red_guy_sheet.png');
}

function setup() {
    createCanvas(CANVAS_HEIGHT, CANVAS_WIDTH);
    noSmooth();
    playLevelMusic();
}

function draw() {
    switch (levelRender) {
        case 'menu':
            menuDraw();
            break;
        case 'rock':
            rockDraw();
            break;
        default:
            break;
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
    playLevelMusic();
}

function keyPressed() {
    pressedKeys[key] = true;
}

function keyReleased() {
    pressedKeys[key] = false;
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
