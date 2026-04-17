let projectiles = [];
let player_x = 200;
let player_y = 200;
let player_1;
var wave_length = 3;
var boss_spawned = false;


function rockSetup() {
  gameOver = false;
  gameOverMusicPlaying = false;
  player_1 = new Player(player_x, player_y, spriteData, spritesheet, 0.1);
  projectiles = [];
  enemies = []
  boss = [];
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
    enemies.push(new Grunt(random_x, random_y, player_1.x, player_1.y, runnerData, runnerSheet, 0.1, 3, 30));
    enemies.push(new Shooter(random_x, random_y, player_1.x, player_1.y, big_bassData, big_bassSheet, 0.1, 1.5, 120, 100));
    enemies.push(new Bomber(random_x, random_y, player_1.x, player_1.y, amp_smallData, amp_smallSheet, 0.1, 1.5, 120, 100));
  }
}

function spawnBoss() {
  if (boss_spawned === true) {
    return;
  } else {
    let startX = CANVAS_WIDTH + 500; 
    let targetX = CANVAS_WIDTH - 200;
    boss.push(new rockBoss(startX, CANVAS_HEIGHT - 450, targetX, player_1.y, 200, dragonJSON, dragonSpriteSheet, 0.1, 0.3, 30, 10))
    boss_spawned = true;
  }
}


function rockDraw() {
  image(metal_back, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  /**
   * Logic in this if statement plays when the game is not paused.
   * Should be things like updating movement, checking for collision, ext.
   */
  if (!paused) {
    // Updates player position
    player_1.update();

    /**
     * Collision checking for all projectiles types
     */
    for (let i = projectiles.length - 1; i >= 0; i--) { // apparently theres actually a good reason for looping backwards
      projectiles[i].update();

      // Check for collisions of projectiles 
      for (let j = enemies.length - 1; j >= 0; j--) {
        if (projectiles[i].getPlayType() == 'player' && projectiles[i].checkHit(enemies[j])) {
          // If a bomber gets hit, it explodes
          if (enemies[j] instanceof Bomber) {
            enemies[j].explode();
          } else {
            enemies.splice(j, 1);
          }
          projectiles.splice(i, 1);
          break; // leaves loop because enemy gone
        }

        if (projectiles[i].checkHit(player_1) && projectiles[i].getPlayType() == "rockShooter" && player_1.can_hit == true) { // this detects hits on the player
          player_1.health--;
          player_1.invincible();
          console.log(player_1.health);
          if (player_1.health <= 0) {
            gameOver = true;
          }
          break;
        }
      }

      // Checks for collisions for player and boss projectiles
      if (boss_spawned) {

        // Checks to see if player hit boss
        for (let b = boss.length - 1; b >= 0; b--) {
          if (projectiles[i].getPlayType() === 'player' && projectiles[i].checkHit(boss[b]) && boss[b].entered_scene == true) {
            if (boss[b].can_hit === true) {
              boss[b].health--;
              boss[b].invincible();
            }
            console.log(boss[b].health);
            projectiles.splice(i, 1);
            if (boss[b].health <= 0) {
              boss[b].is_dead = true;
              boss.splice(b, 1);
            }
            break; // leaves loop because enemy gone
          }

          // Checks to see if boss hit player 
          if (projectiles[i].checkHit(player_1) && projectiles[i].getPlayType() == "rockShooter" && player_1.can_hit == true) { // this detects hits on the player
            player_1.health--;
            player_1.invincible();
            console.log(player_1.health);
            if (player_1.health <= 0) {
              gameOver = true;
            }
            break;
        }
        }
      }
      

      // Remove bullet once it's off-screen
      if (projectiles[i] && projectiles[i].isOffScreen()) { // first check is added because you need to check if the bullet is still there
        projectiles.splice(i, 1);
      }
    }

    /**
     * Checks for collision of any enemy type and the player. Detracts health if a collision occurs.
     * Collision occurs if the enemies radius (r) is within the player's radius (r). 
     */
    for (let i = enemies.length - 1; i >= 0; i--) {
      enemies[i].update(player_1);
      
      let distance = dist(enemies[i].pos.x, enemies[i].pos.y, player_1.pos.x, player_1.pos.y);
      if (distance < enemies[i].r + player_1.r) {
        if (enemies[i] instanceof Grunt) {
          enemies[i].knockback();
        }
        if (player_1.can_hit == true) {
          // Bombers explode and disappear after the animation plays
        if (enemies[i] instanceof Bomber) {
          enemies[i].explode(i);
        }
        player_1.health--;
          player_1.invincible();
          console.log(player_1.health); // this is for testing to make sure health is going down correctly
          if (player_1.health <= 0) {
            gameOver = true;
          }
        }
      }
    }

    /**
     * Same collision check as above, now with the bosses' radius 
     */
    if (boss_spawned) {
        for (let b = boss.length - 1; b >= 0; b--) {
          boss[b].update(player_1);

          let distance = dist(boss[b].pos.x, boss[b].pos.y, player_1.pos.x, player_1.pos.y);
          if ((distance < boss[b].r + player_1.r ) && player_1.can_hit == true) {
            player_1.health--;
            player_1.invincible();
            console.log(player_1.health);
            if (player_1.health <= 0) {
              gameOver = true;
            }
          }
        }
      }

    // Wave logic
    if (enemies.length === 0) {
      if (wave_length != 0) {
        spawnRockBaddies(8);
        wave_length--;
      } else {
        spawnBoss();
        //boss_spawned = true;
      }
    } 
  }

  /**
   * Render all sprites.
   */
  player_1.draw();
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].display();
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].draw();
  }
  for (let i = 0; i < boss.length; i++) {
    if (boss[i].entered_scene === false) {
      boss[i].enterScene();
      boss[i].draw();
    } else {
      boss[i].draw();
    }
    
  }
  
  // Display health bar
  displayHealthBar(player_1);
}
