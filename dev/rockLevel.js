let projectiles = [];
let player_x = 200;
let player_y = 200;
let player_1;


function rockSetup() {
  player_1 = new Player(player_x, player_y);
  projectiles = [];
}

function rockDraw() {
  image(metal_back, 0, 0, CANVAS_HEIGHT, CANVAS_WIDTH);
  player_1.update();
  player_1.draw();
  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].update();
    projectiles[i].display();

    if (projectiles[i].isOffScreen()) {
      projectiles.splice(i, 0)
    }
  }
}

function mousePressed() {
  console.log("click")
  projectiles.push(new Projectile(player_1.x, player_1.y, mouseX, mouseY, "player"));
}

