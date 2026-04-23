let gifX, gifY;
let walkingDone = false;

function endScreenSetup() {
  gifX = -80;                          
  gifY = (CANVAS_HEIGHT / 2) + 80;    
  walkingDone = false;
}

function endScreenDraw() {
  if (!walkingDone) {
    image(endScene, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (gifX < CANVAS_WIDTH / 2) {
      gifX += 4;
    } else {
      walkingDone = true;
    }
    image(playerWalking, gifX, gifY, 80, 80); 
  } else {
    image(endScenePlayer, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
