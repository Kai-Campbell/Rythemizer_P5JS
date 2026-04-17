function lofiSetup() {
  gameOver = false;
  gameOverMusicPlaying = false;
  player_1 = new Player(player_x, player_y, spriteData, spritesheet, 0.1);
  projectiles = [];
  for (let x = enemies.length - 1; x >= 0; x--) { // this will reset the enemies on screen
    enemies.splice(x, 1);
  }
}

function spawnBaddies(count) {
  for (let i = 0; i < count; i++) {
    let random_x = random(CANVAS_WIDTH); // spawns enemies at random positions near the top and sides
    let random_y;
    if (random() < 0.5) {
      random_y = random(-50, -20); // this one they spawn at the top
    } else {
      random_y = random(CANVAS_HEIGHT + 20, CANVAS_HEIGHT + 50); // this one they spawn at the bottom
    }
    enemies.push(new Grunt(random_x, random_y, player_1.x, player_1.y, runnerData, runnerSheet, 0.1, 3));
  }
}

function lofiDraw() {
  image(lofi_back, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  if (!paused) {
    player_1.update();
    for (let i = projectiles.length - 1; i >= 0; i--) { // apparently theres actually a good reason for looping backwards
      projectiles[i].update();

      for (let j = enemies.length - 1; j >= 0; j--) {
        if (projectiles[i].checkHit(enemies[j])) {
          enemies.splice(j, 1);
          projectiles.splice(i, 1);
          break; // leaves loop because enemy gone
        }
      }

      if (projectiles[i] && projectiles[i].isOffScreen()) { // first check is added because you need to check if the bullet is still there
        projectiles.splice(i, 1);
      }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      enemies[i].update(player_1);
      
      // Check for grunt contact damage
      let distance = dist(enemies[i].pos.x, enemies[i].pos.y, player_1.pos.x, player_1.pos.y);
      if (distance < enemies[i].r + player_1.r && player_1.can_hit == true) {
        player_1.health--;
        player_1.invincible();
        console.log(player_1.health);
        if (player_1.health <= 0) {
          gameOver = true;
        }
        if (enemies[i] instanceof Grunt) {
          enemies[i].knockback();
        }
      }
    }

    if (enemies.length === 0) { // infinite enemies mode
      spawnBaddies(8);
    }
  }

  player_1.draw();
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].display();
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].draw();
  }
  
  displayHealthBar(player_1);
}
