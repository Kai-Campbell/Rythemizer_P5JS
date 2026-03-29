function setup() {
  createCanvas(960, 540);
  x = 0;
}

function draw() {
  background(220);
  startButton();
  levelButton();
  tutorialButton();
  settingsButton();
}

function startButton() {
  fill("red");
  rect(360, 180, 240, 60);
  
  textSize(20);
  textAlign(CENTER);
  fill("black");
  text("Start", 480, 215);
  
  if (mouseX >= 360 && mouseX <= 600 &&
     mouseY >= 180 && mouseY <= 240 &&
     mouseIsPressed == true) {
    console.log("Start");
    window.location.href = 'rockLevel.html'; // this moves to the test level right now
  }
}
  
  function levelButton() {
  level = ["Story Mode", "Arcade Mode", "Chao Mode"];
  fill("red");
  rect(360, 260, 240, 60);
  
  textSize(20);
  textAlign(CENTER);
  fill("black");
  text(level[x], 480, 295);
  
  if (mouseX >= 360 && mouseX <= 600 &&
     mouseY >= 260 && mouseY <= 320 &&
     mouseIsPressed == true) {
    if (x == 2) {
      x = 0;
      mouseIsPressed = false;
    } else {
      x++;
      mouseIsPressed = false;
    }
  }
}

function tutorialButton() {
  fill("red");
  rect(360, 340, 240, 60);
  
  textSize(20);
  textAlign(CENTER);
  fill("black");
  text("How To Play", 480, 375);
  
  if (mouseX >= 360 && mouseX <= 600 &&
     mouseY >= 340 && mouseY <= 400 &&
     mouseIsPressed == true) {
    console.log("How To");
  }
}
  
function settingsButton() {
  fill("red");
  rect(360, 420, 240, 60);
  
  textSize(20);
  textAlign(CENTER);
  fill("black");
  text("Settings", 480, 455);
  
  if (mouseX >= 360 && mouseX <= 600 &&
     mouseY >= 420 && mouseY <= 480 &&
     mouseIsPressed == true) {
    console.log("Settings");
  }
}