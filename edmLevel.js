function edmSetup() {
  player_1 = new Player(player_x, player_y, spriteData, spritesheet, 0.1);
  projectiles = [];
}

function edmDraw() {
  image(edm_back, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  if (!paused) {
    player_1.update();
    for (let i = projectiles.length - 1; i >= 0; i--) {
      projectiles[i].update();
      if (projectiles[i].isOffScreen()) {
        projectiles.splice(i, 1);
      }
    }
  }
  player_1.draw();
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].display();
  }
}
