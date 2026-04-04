function edmSetup() {
  player_1 = new Player(player_x, player_y);
  projectiles = [];
}

function edmDraw() {
  image(edm_back, 0, 0, CANVAS_HEIGHT, CANVAS_WIDTH);
  player_1.update();
  player_1.draw();
  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].update();
    projectiles[i].display();

    if (projectiles[i].isOffScreen()) {
      projectiles.splice(i, 0);
    }
  }
}
