function menuDraw() {
  background(220);
  image(menuLargeBg, 0, 0, CANVAS_HEIGHT, CANVAS_WIDTH);
  image(menuBacking, 160, -90, 650, 700);
  startButton();
  levelButton();
  tutorialButton();
  settingsButton();
}

let currentMode = 0;
let modeClicked = false;

function startButton() {
  image(menuStartButton[0], 360, 130, 240, 60);
  
  if (mouseX >= 360 && mouseX <= 600 &&
     mouseY >= 130 && mouseY <= 190) {
    image(menuStartButton[1], 360, 130, 240, 60);

    if (mouseIsPressed) {
      switchLevel('rock');
    }
  }
}
  
function levelButton() {
  const modeButtons = [menuStoryButton, menuArcadeButton, menuChaoButton];
  
  image(modeButtons[currentMode][0], 360, 210, 240, 60);
  
  const hovering = mouseX >= 360 && mouseX <= 600 &&
     mouseY >= 210 && mouseY <= 270;
  
  if (hovering) {
    image(modeButtons[currentMode][1], 360, 210, 240, 60);

    if (mouseIsPressed && !modeClicked) {
      modeClicked = true;
      currentMode = (currentMode + 1) % 3;
    }
  }
  
  if (!mouseIsPressed) {
    modeClicked = false;
  }
}

function tutorialButton() {
  image(menuHowToButton[0], 360, 340 - 50, 240, 60);
  
  if (mouseX >= 360 && mouseX <= 600 &&
     mouseY >= 340 - 50 && mouseY <= 400 - 50) {
    image(menuHowToButton[1], 360, 340 - 50, 240, 60);
  }
}
  
function settingsButton() {
  image(menuSettingsButton[0], 360, 420 - 50, 240, 60);
  
  if (mouseX >= 360 && mouseX <= 600 &&
     mouseY >= 420 - 50 && mouseY <= 480 - 50) {
    image(menuSettingsButton[1], 360, 420 - 50, 240, 60);
  }
}
