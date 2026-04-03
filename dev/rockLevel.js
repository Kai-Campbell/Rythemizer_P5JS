function rockSetup() {
  player_1 = new Player(player_x, player_y, spriteData, spritesheet, 0.1);
  projectiles = [];
}

function rockDraw() {
  image(metal_back, 0, 0, CANVAS_HEIGHT, CANVAS_WIDTH);
  player_1.update();
  player_1.draw();
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update();
    projectiles[i].display();

    if (projectiles[i].isOffScreen()) {
      projectiles.splice(i, 1);
    }
  }

}
