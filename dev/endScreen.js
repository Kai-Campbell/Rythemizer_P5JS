function endScreenSetup() {
  player_1 = new Player((CANVAS_WIDTH / 2) + 30, -300, spriteData, spritesheet, 0.1);
}

function endScreenDraw() {
  image(endScene, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  player_1.enterEndScene(600);
  player_1.justShow(80, 80);
  if (!player_1.is_entering) {
    image(endScenePlayer, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
