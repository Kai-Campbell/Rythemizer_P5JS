let gifX, gifY;
let walkingDone = false;

function endScreenSetup() {
  gifX = -80;                          
  gifY = (CANVAS_HEIGHT / 2) + 155;    
  walkingDone = false;
}

function endScreenDraw() {
  if (!walkingDone) {
    image(endScene, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (gifX < (CANVAS_WIDTH / 2) - 30) {
      gifX += 4;
    } else {
      walkingDone = true;
    }
    image(playerWalking, gifX, gifY, 105, 105); 
  } else {
    image(endScenePlayer, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
