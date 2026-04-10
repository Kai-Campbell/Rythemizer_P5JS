let projectiles = [];
let player_x = 200;
let player_y = 200;
let player_1;
var wave_length = 3


function rockSetup() {
  player_1 = new Player(player_x, player_y, spriteData, spritesheet, 0.1);
  projectiles = [];
  enemies = []
}

function spawnRockBaddies(count) {
  for (let i = 0; i < count; i++) {
    let random_x = random(CANVAS_WIDTH); // spawns enemies at random positions near the top and sides
    let random_y;
    if (random() < 0.5) {
      random_y = random(-50, -20); // this one they spawn at the top
    } else {
      random_y = random(CANVAS_HEIGHT + 20, CANVAS_HEIGHT + 50); // this one they spawn at the bottom
    }
    enemies.push(new Grunt(random_x, random_y, player_1.x, player_1.y, runnerData, runnerSheet, 0.1, 3));
    enemies.push(new Shooter(random_x, random_y, player_1.x, player_1.y, big_bassData, big_bassSheet, 0.1, 1.5, 120));
  }
}


function rockDraw() {
  image(metal_back, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  if (!paused) {
    player_1.update();
    for (let i = projectiles.length - 1; i >= 0; i--) { // apparently theres actually a good reason for looping backwards
      projectiles[i].update();

      for (let j = enemies.length - 1; j >= 0; j--) {
        if (projectiles[i].getPlayType() == 'player' && projectiles[i].checkHit(enemies[j])) {
          enemies.splice(j, 1);
          projectiles.splice(i, 1);
          break; // leaves loop because enemy gone
        }

        if (projectiles[i].checkHit(player_1) && projectiles[i].getPlayType() == "rockShooter") {
          player_1.health--;
          console.log(player_1.health);
          break;
        }
      }


      if (projectiles[i] && projectiles[i].isOffScreen()) { // first check is added because you need to check if the bullet is still there
        projectiles.splice(i, 1);
      }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      enemies[i].update(player_1);
    }

    if (enemies.length === 0 && wave_length != 0) { // infinite enemies mode
      spawnRockBaddies(8);
      wave_length--;
    } else {
      // console.log("load boss")
    }
  }

  player_1.draw();
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].display();
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].draw();
  }
}
