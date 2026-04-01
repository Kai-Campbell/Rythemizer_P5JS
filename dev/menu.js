

let x = 0;
let levelClicked = false;

function menuDraw() {
  background(220);
  image(menuLargeBg, 0, 0, CANVAS_HEIGHT, CANVAS_WIDTH);
  image(menuBacking, 160, -90, 650, 700);
  startButton();
  levelButton();
  tutorialButton();
  settingsButton();
}

function startButton() {
  fill("red");
  rect(360, 180 - 50, 240, 60); // the minus 50 was for when the menu asset was placed and the buttons were adjusted
  
  textSize(20);
  textAlign(CENTER);
  fill("black");
  text("Start", 480, 215 - 50);
  
  if (mouseX >= 360 && mouseX <= 600 &&
     mouseY >= 180 - 50 && mouseY <= 240 - 50 &&
     mouseIsPressed == true) {
    console.log("Start");
    switchLevel('rock');
  }
}
  
function levelButton() {
  const levels = ["Story Mode", "Arcade Mode", "Chao Mode"];
  fill("red");
  rect(360, 260 - 50, 240, 60);
  
  textSize(20);
  textAlign(CENTER);
  fill("black");
  text(levels[x], 480, 295 - 50);
  
  const hovering = mouseX >= 360 && mouseX <= 600 &&
     mouseY >= 260 - 50 && mouseY <= 320 - 50;
  
  if (hovering && mouseIsPressed && !levelClicked) {
    levelClicked = true;
    x = (x + 1) % levels.length;
  }
  
  if (!mouseIsPressed) {
    levelClicked = false;
  }
}

function tutorialButton() {
  fill("red");
  rect(360, 340 - 50, 240, 60);
  
  textSize(20);
  textAlign(CENTER);
  fill("black");
  text("How To Play", 480, 375 - 50);
  
  if (mouseX >= 360 && mouseX <= 600 &&
     mouseY >= 340 - 50 && mouseY <= 400 - 50 &&
     mouseIsPressed == true) {
    console.log("How To");
  }
}
  
function settingsButton() {
  fill("red");
  rect(360, 420 - 50, 240, 60);
  
  textSize(20);
  textAlign(CENTER);
  fill("black");
  text("Settings", 480, 455 - 50);
  
  if (mouseX >= 360 && mouseX <= 600 &&
     mouseY >= 420 - 50 && mouseY <= 480 - 50 &&
     mouseIsPressed == true) {
    console.log("Settings");
  }
}
