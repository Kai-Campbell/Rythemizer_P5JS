// Menu variables for sizing
const MENU_WIDTH = 650;
const MENU_HEIGHT = 700;
const CENTER_OF_MENU = (CANVAS_WIDTH / 2) - 10;
const MENU_Y = (MENU_HEIGHT / 10);
const FIRST_BUT = MENU_Y + 250;

// Button size and gap variables
const BUTTON_W = 240
const BUTTON_H = 60
const BUTTON_GAP = 75;

// Tutorial button click flag
let tutorialClicked = false;

// Settings overlay (uses globals sfx_volume and music_volume from main.js)
let showSettings = false;
let settingsUIMouseLock = false;

// Keeps track of the button that currently hover, useful for SFX
let currentHoveredID = null;

const SETTINGS_SLIDER_W = 260;
const SETTINGS_SLIDER_H = 22;
const SETTINGS_ROW_SFX_Y = FIRST_BUT + 30;
const SETTINGS_ROW_MUSIC_Y = FIRST_BUT + 95;
const SETTINGS_BACK_Y = FIRST_BUT + 200;

/**
 * Main menu that welcomes the player to the game
 */
function menuDraw() {
  // Draw background image
  image(menuLargeBg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // Draw main menu relative to screen resolution
  image(menuBacking, (CANVAS_WIDTH / 2) - (MENU_WIDTH / 2), MENU_Y, MENU_WIDTH, MENU_HEIGHT);
  
  // Change image placement to center
  imageMode(CENTER);
  pulsingLogo();
  if (!showSettings) {
    startButton(CENTER_OF_MENU, FIRST_BUT, BUTTON_W, BUTTON_H);
    levelButton(CENTER_OF_MENU, FIRST_BUT + BUTTON_GAP, BUTTON_W, BUTTON_H);
    tutorialButton(CENTER_OF_MENU, FIRST_BUT + BUTTON_GAP * 2, BUTTON_W, BUTTON_H);
    settingsButton(CENTER_OF_MENU, FIRST_BUT + BUTTON_GAP * 3, BUTTON_W, BUTTON_H);
  } else {
    drawSettingsMenu();
  }
  // Change back to not break other image renders
  imageMode(CORNER);
}

/**
 * Pause menu 
 * Appears when the escape key (and eventually start button on controller)
 */
function pauseMenuDraw() {
  // Draw main menu relative to screen resolution
  image(menuBacking, (CANVAS_WIDTH / 2) - (MENU_WIDTH / 2), MENU_Y, MENU_WIDTH, MENU_HEIGHT);
  
  // Change image placement to center
  imageMode(CENTER);
  pulsingLogo();
  if (!showSettings) {
    startButton(CENTER_OF_MENU, FIRST_BUT, BUTTON_W, BUTTON_H);
    tutorialButton(CENTER_OF_MENU, FIRST_BUT + BUTTON_GAP, BUTTON_W, BUTTON_H);
    settingsButton(CENTER_OF_MENU, FIRST_BUT + BUTTON_GAP * 2, BUTTON_W, BUTTON_H);
  } else {
    drawSettingsMenu();
  }
  // Change back to not break other image renders
  imageMode(CORNER);
}

let currentMode = 0;
let modeClicked = false;

/**
 * Displays the pulsing RYTHEMIZER logo.
 */
function pulsingLogo() {
  let scale = 1 + 0.1 * sin(frameCount * 0.02);
  let scaleFactor = 400 / menuLogoGlow.width;
  let baseWidth = menuLogoGlow.width * scaleFactor;
  let baseHeight = menuLogoGlow.height * scaleFactor;
  let centerX = 10 + baseWidth / 2;
  let centerY = 10 + baseHeight / 2;
  // let x = centerX - (baseWidth * scale / 2);
  // let y = centerY - (baseHeight * scale / 2);
  let x = CENTER_OF_MENU;
  let y = MENU_Y + 10;
  image(menuLogoGlow, x, y, baseWidth * scale, baseHeight * scale);
}

/**
 * Start button - Begins the game
 */
function startButton(x, y, w, h) {
  image(menuStartButton[0], x, y, w, h);
  
  if (isHovering("strt", x, y, w, h)) {
    image(menuStartButton[1], x, y, w, h);

    if (mouseIsPressed) {
      playSFX("click");
      if (currentMode === 1) {
        game_mode = 'arcade';
      } else if (currentMode === 2) {
        game_mode = 'chaos';
      } else {
        game_mode = 'story';
      }
      if (game_mode === 'arcade') {
        switchLevel('rock');
      } else {
        switchLevel('lofi'); // story / chaos currently start on lofi
      }
    }
  }
}
 
/**
 * Level Button - Changes difficulty / mode
 */
function levelButton(x, y, w, h) {
  const modeButtons = [menuStoryButton, menuArcadeButton, menuChaoButton];

  image(modeButtons[currentMode][0], x, y, w, h);

  if (isHovering("lvl", x, y, w, h)) {
    image(modeButtons[currentMode][1], x, y, w, h);

    if (mouseIsPressed && !modeClicked) {
      playSFX("click");
      modeClicked = true;
      currentMode = (currentMode + 1) % 3;
    }
  }

  if (!mouseIsPressed) {
    modeClicked = false;
  }
}

/**
 * Tutorial button
 */
function tutorialButton(x, y, w, h) {
  image(menuHowToButton[0], x, y, w, h);
  
  if (isHovering("tut", x, y, w, h)) {
    image(menuHowToButton[1], x, y, w, h);
    
    if (mouseIsPressed && !tutorialClicked) {
      playSFX("click");
      tutorialClicked = true;
      levelRender = "tutorial";
      playLevelMusic();
      tutorialIndex = 0;
    }
  }
  
  if (!mouseIsPressed) {
    tutorialClicked = false;
  }
}
  
/**
 * Settings button
 */
function settingsButton(x, y, w, h) {
  image(menuSettingsButton[0], x, y, w, h);
  
  if (isHovering("set", x, y, w, h)) {
    image(menuSettingsButton[1], x, y, w, h);

    if (mouseIsPressed && !settingsUIMouseLock) {
      playSFX("click");
      settingsUIMouseLock = true;
      showSettings = true;
    }
  }

  if (!mouseIsPressed) {
    settingsUIMouseLock = false;
  }
}

/**
 * Settings panel: adjusts globals sfx_volume and music_volume (same names as soundFX.js / playLevelMusic).
 */
function drawSettingsMenu() {
  const trackLeft = CENTER_OF_MENU - SETTINGS_SLIDER_W / 2;
  const trackRight = CENTER_OF_MENU + SETTINGS_SLIDER_W / 2;

  fill(0, 0, 0, 200);
  noStroke();
  rectMode(CENTER);
  rect(CENTER_OF_MENU, MENU_Y + MENU_HEIGHT / 2 - 40, MENU_WIDTH - 80, 420, 12);
  rectMode(CORNER);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(28);
  text("SETTINGS", CENTER_OF_MENU, MENU_Y + 120);
  textSize(18);

  updateAndDrawSfxVolumeSlider(SETTINGS_ROW_SFX_Y, trackLeft, trackRight);
  updateAndDrawMusicVolumeSlider(SETTINGS_ROW_MUSIC_Y, trackLeft, trackRight);

  drawSettingsBackButton(CENTER_OF_MENU, SETTINGS_BACK_Y);

  if (!mouseIsPressed) {
    settingsUIMouseLock = false;
  }
}

function volumeSliderPointerOnTrack(rowCenterY, trackLeft, trackRight) {
  const halfHit = SETTINGS_SLIDER_H + 8;
  return (
    mouseIsPressed &&
    mouseY >= rowCenterY - halfHit &&
    mouseY <= rowCenterY + halfHit &&
    mouseX >= trackLeft &&
    mouseX <= trackRight
  );
}

function updateAndDrawSfxVolumeSlider(rowCenterY, trackLeft, trackRight) {
  if (volumeSliderPointerOnTrack(rowCenterY, trackLeft, trackRight)) {
    sfx_volume = constrain((mouseX - trackLeft) / SETTINGS_SLIDER_W, 0, 1);
  }

  fill(255);
  text("SFX volume", CENTER_OF_MENU, rowCenterY - 28);

  fill(60);
  rectMode(CENTER);
  rect(CENTER_OF_MENU, rowCenterY, SETTINGS_SLIDER_W, SETTINGS_SLIDER_H, 6);

  fill(120, 200, 255);
  rectMode(CORNER);
  rect(trackLeft, rowCenterY - SETTINGS_SLIDER_H / 2, SETTINGS_SLIDER_W * sfx_volume, SETTINGS_SLIDER_H, 6);

  fill(255);
  textSize(14);
  text(Math.round(sfx_volume * 100) + "%", trackRight + 36, rowCenterY);
  textSize(18);
}

function updateAndDrawMusicVolumeSlider(rowCenterY, trackLeft, trackRight) {
  if (volumeSliderPointerOnTrack(rowCenterY, trackLeft, trackRight)) {
    music_volume = constrain((mouseX - trackLeft) / SETTINGS_SLIDER_W, 0, 1);
    if (typeof applyMusicVolume === "function") {
      applyMusicVolume();
    }
  }

  fill(255);
  text("Music volume", CENTER_OF_MENU, rowCenterY - 28);

  fill(60);
  rectMode(CENTER);
  rect(CENTER_OF_MENU, rowCenterY, SETTINGS_SLIDER_W, SETTINGS_SLIDER_H, 6);

  fill(180, 200, 255);
  rectMode(CORNER);
  rect(trackLeft, rowCenterY - SETTINGS_SLIDER_H / 2, SETTINGS_SLIDER_W * music_volume, SETTINGS_SLIDER_H, 6);

  fill(255);
  textSize(14);
  text(Math.round(music_volume * 100) + "%", trackRight + 36, rowCenterY);
  textSize(18);
}

function drawSettingsBackButton(x, y) {
  const bw = 160;
  const bh = 44;
  const hovering =
    mouseX >= x - bw / 2 &&
    mouseX <= x + bw / 2 &&
    mouseY >= y - bh / 2 &&
    mouseY <= y + bh / 2;

  rectMode(CENTER);
  if (hovering) {
    fill(120, 120, 170);
  } else {
    fill(80, 80, 120);
  }
  stroke(255);
  strokeWeight(2);
  rect(x, y, bw, bh, 8);

  fill(255);
  noStroke();
  textSize(20);
  text("Back", x, y);

  if (hovering && mouseIsPressed && !settingsUIMouseLock) {
    playSFX("click");
    settingsUIMouseLock = true;
    showSettings = false;
  }

  rectMode(CORNER);
}


/*
======================================
---------- Helper functions ----------
======================================
*/

/**
 * Returns true when mouse is detected within the bounds
 * Update: now plays a sound when the user hovers
 * @param id This serves as a unique identifier to help track when the cursor
 * leaves the bounds of the button (for SFX playing) 
 */
function isHovering(id, x, y, w, h) {
  var isHovering = (mouseX >= x - w/2 && mouseX <= x + w/2 &&
          mouseY >= y - h/2 && mouseY <= y + h/2); 


  // if it's hovering, let's play a sound (FX)! and keep track that we are now hovering a particular button
  if (isHovering) {
    if (currentHoveredID != id) {
      playSFX("hover");
      currentHoveredID = id;
    }
  } else if (currentHoveredID === id) {
    // If we've left a particular button, reset currently hovered to null
    currentHoveredID = null;
  }
  return isHovering;
}
