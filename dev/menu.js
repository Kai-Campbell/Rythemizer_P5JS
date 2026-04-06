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
  startButton(CENTER_OF_MENU, FIRST_BUT, BUTTON_W, BUTTON_H);
  levelButton(CENTER_OF_MENU, FIRST_BUT + BUTTON_GAP, BUTTON_W, BUTTON_H);
  tutorialButton(CENTER_OF_MENU, FIRST_BUT + BUTTON_GAP * 2, BUTTON_W, BUTTON_H);
  settingsButton(CENTER_OF_MENU, FIRST_BUT + BUTTON_GAP * 3, BUTTON_W, BUTTON_H);
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
  startButton(CENTER_OF_MENU, FIRST_BUT, BUTTON_W, BUTTON_H);
  levelButton(CENTER_OF_MENU, FIRST_BUT + BUTTON_GAP, BUTTON_W, BUTTON_H);
  tutorialButton(CENTER_OF_MENU, FIRST_BUT + BUTTON_GAP * 2, BUTTON_W, BUTTON_H);
  settingsButton(CENTER_OF_MENU, FIRST_BUT + BUTTON_GAP * 3, BUTTON_W, BUTTON_H);
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
  
  if (isHovering(x, y, w, h)) {
    image(menuStartButton[1], x, y, w, h);

    if (mouseIsPressed) {
      switchLevel('rock');
    }
  }
}
 
/**
 * Level Button - Changes difficulty / mode
 */
function levelButton(x, y, w, h) {
  const modeButtons = [menuStoryButton, menuArcadeButton, menuChaoButton];

  image(modeButtons[currentMode][0], x, y, w, h);

  if (isHovering(x, y, w, h)) {
    image(modeButtons[currentMode][1], x, y, w, h);

    if (mouseIsPressed && !modeClicked) {
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
  
  if (isHovering(x, y, w, h)) {
    image(menuHowToButton[1], x, y, w, h);
  }
}
  
/**
 * Settings button
 */
function settingsButton(x, y, w, h) {
  image(menuSettingsButton[0], x, y, w, h);
  
  if (isHovering(x, y, w, h)) {
    image(menuSettingsButton[1], x, y, w, h);
  }
}


/*
======================================
---------- Helper functions ----------
======================================
*/

/**
 * Returns true when mouse is detected within the bounds
 */
function isHovering(x, y, w, h) {
  return mouseX >= x - w/2 && mouseX <= x + w/2 &&
          mouseY >= y - h/2 && mouseY <= y + h/2;
}
