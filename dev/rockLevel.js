let projectiles = [];
let player_x = 200;
let player_y = -300;
let player_1;
let aimX = 0;
let aimY = 0;
const GUN_BARREL_OFFSET = 60; // tweak this to match the pixel distance of the laser and the gun
const story_wave_length = 5;
var wave_length = story_wave_length;
var boss_spawned = false;
var arcade_wave = 0;
var arcade_waves_survived = 0;
var end_entered = 0;


function rockSetup() {
  gameOver = false;
  gameOverMusicPlaying = false;
  wave_length = story_wave_length;
  boss_spawned = false;
  arcade_wave = 0;
  arcade_waves_survived = 0;
  player_1 = new Player(player_x, player_y, spriteData, spritesheet, 0.1);
  projectiles = [];
  enemies = [];
  boss = [];
  items = [];
  player_1.powerUpTimer = POWERUP_DURATION;
}

function spawnRockBaddies(count, waveConfig = null) {
  let gruntSpeed = 3;
  let shooterMoveSpeed = 1.5;
  let shooterShootSpeed = 120;
  let bomberSpeed = 1.5;

  if (waveConfig !== null) {
    if (waveConfig.gruntSpeed !== undefined) {
      gruntSpeed = waveConfig.gruntSpeed;
    }
    if (waveConfig.shooterMoveSpeed !== undefined) {
      shooterMoveSpeed = waveConfig.shooterMoveSpeed;
    }
    if (waveConfig.shooterShootSpeed !== undefined) {
      shooterShootSpeed = waveConfig.shooterShootSpeed;
    }
    if (waveConfig.bomberSpeed !== undefined) {
      bomberSpeed = waveConfig.bomberSpeed;
    }
  }

  for (let i = 0; i < count; i++) {
    let random_x = random(CANVAS_WIDTH); // spawns enemies at random positions near the top and sides
    let random_y;
    if (random() < 0.5) {
      random_y = random(-50, -20); // this one they spawn at the top
    } else {
      random_y = random(CANVAS_HEIGHT + 20, CANVAS_HEIGHT + 50); // this one they spawn at the bottom
    }
    //enemies.push(new Grunt(random_x, random_y, player_1.x, player_1.y, runnerData, runnerSheet, 0.1, gruntSpeed, 30));
    enemies.push(new Shooter(random_x, random_y, player_1.x, player_1.y, big_bassData, big_bassSheet, 0.1, shooterMoveSpeed, shooterShootSpeed, 185 * 0.65, 240 * 0.65));
    enemies.push(new Bomber(random_x, random_y, player_1.x, player_1.y, amp_smallData, amp_smallSheet, 0.1, bomberSpeed, 120, 100));
  }
}

function getArcadeWaveConfig(waveNumber) {
  // Starts easy and ramps continuously as wave number grows.
  const waveTier = max(0, waveNumber - 1);
  return {
    squadCount: 1 + floor(waveTier / 2),
    gruntSpeed: min(6.5, 2.6 + waveTier * 0.08),
    shooterMoveSpeed: min(4.6, 1.2 + waveTier * 0.07),
    shooterShootSpeed: max(36, 140 - waveTier * 3),
    bomberSpeed: min(4.8, 1.2 + waveTier * 0.075),
  };
}

function spawnBoss() {
  if (boss_spawned === true) {
    return;
  } else {
    let startX = CANVAS_WIDTH + 500; 
    let targetX = CANVAS_WIDTH - 200;
    boss.push(new rockBoss(startX, CANVAS_HEIGHT - 450, targetX, player_1.y, 200, dragonJSON, dragonSpriteSheet, 0.1, 0.3, 50, 10))
    boss_spawned = true;
  }
}


function rockDraw() {
  image(metal_back, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  /**
   * Logic in this if statement plays when the game is not paused.
   * Should be things like updating movement, checking for collision, ext.
   */

  player_1.enterScene(); // these two functions handle level transitions
  if (game_mode === 'story') {
    player_1.leaveScene('end');
  } else {
    player_1.leaveScene('lofi');
  }

  if (!paused && !player_1.is_entering) {
    let aimX = mouseX;
    let aimY = mouseY;
    const gp = navigator.getGamepads ? navigator.getGamepads()[0] : null;
    if (gp && (abs(gp.axes[2]) > 0.1 || abs(gp.axes[3]) > 0.1)) {
      const aimDist = 200;
      aimX = player_1.pos.x + gp.axes[2] * aimDist;
      aimY = player_1.pos.y + gp.axes[3] * aimDist;
    }

    // Updates player position
    player_1.update();
    if (firePending) { // Calculate position from the controller aim to the player
      let angle = atan2(aimY - player_1.pos.y, aimX - player_1.pos.x);
      let spawnX = player_1.pos.x + cos(angle) * GUN_BARREL_OFFSET;
      let spawnY = player_1.pos.y + sin(angle) * GUN_BARREL_OFFSET;
      projectiles.push(new Projectile(spawnX, spawnY, aimX, aimY, "player"));
      firePending = false;
    }

    /**
     * Collision checking for all projectiles types
     */
    for (let i = projectiles.length - 1; i >= 0; i--) {
      if (weapon == 2 && projectiles[i].getPlayType() === 'player') {
        // Use aimX/aimY so the laser tracks controller or mouse
        let angle = atan2(aimY - player_1.pos.y, aimX - player_1.pos.x);
        projectiles[i].pos.x = player_1.pos.x + cos(angle) * GUN_BARREL_OFFSET;
        projectiles[i].pos.y = player_1.pos.y + sin(angle) * GUN_BARREL_OFFSET;
        projectiles[i].vel = createVector(aimX - player_1.pos.x, aimY - player_1.pos.y);
        projectiles[i].vel.setMag(8);
      }
      projectiles[i].update();

      if (weapon == 2 && projectiles[i].laserShot && projectiles[i].getPlayType() === 'player') {
        for (let j = enemies.length - 1; j >= 0; j--) {
          let d = distToSegment(
            enemies[j].pos.x, enemies[j].pos.y,
            player_1.pos.x, player_1.pos.y,
            player_1.pos.x + projectiles[i].vel.x * 50,
            player_1.pos.y + projectiles[i].vel.y * 50
          );
          if (d < enemies[j].r) {
            enemies[j].hit = true;
            enemies.splice(j, 1);
          }
        }
      }

      // Check for collisions of projectiles 
      for (let j = enemies.length - 1; j >= 0; j--) {
        if (projectiles[i].getPlayType() == 'player' && projectiles[i].checkHit(enemies[j])) {
          // If a bomber gets hit, it explodes
          if (enemies[j] instanceof Bomber) {
            enemies[j].explode();
          } else {
            let rand = random(15); // around 10 percent chance of spawning
            console.log(rand)
            if (random(1) < 0.3) {
              let itemRoll = random(4);
              if (itemRoll < 1) {
                items.push(new HealthItem(healthBox, enemies[j].pos.x, enemies[j].pos.y));
              } else if (itemRoll < 2) {
                items.push(new PowerUp(shotgunBox, enemies[j].pos.x, enemies[j].pos.y));
              } else if (itemRoll < 3) {
                items.push(new PowerUp(shieldBox, enemies[j].pos.x, enemies[j].pos.y));
              } else {
                items.push(new PowerUp(laserBox, enemies[j].pos.x, enemies[j].pos.y));
              }
            }
            // Play SFX for when enemy dies
            playSFX("enemyGone");
            // Thanos snap enemy from the enemy array
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
              // play Boss hurt SFX
              playSFX("bossHurt");
              // Decrement health and begin invulnerability period
              boss[b].health--;
              boss[b].invincible();
            }
            console.log(boss[b].health);
            projectiles.splice(i, 1);
            if (boss[b].health <= 0) {
              boss[b].is_dead = true;
              if (game_mode == 'story') {
                items.push(new ExitItem(exitItem, boss[b].pos.x, boss[b].pos.y)); // spawns the new exit level item
              }
              if (game_mode == 'arcade') {
                items.push(new ExitItem(shotgunSprite, boss[b].pos.x, boss[b].pos.y)); // spawns the new exit level item
              }
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
      if (projectiles[i] && projectiles[i].isDone()) { // first check is added because you need to check if the bullet is still there
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
        // Bombers explode and disappear after the animation plays
        if (enemies[i] instanceof Bomber) {
          enemies[i].explode(i);
        }
        if (player_1.can_hit == true) {
        player_1.health--;
          player_1.invincible();
          console.log(player_1.health); // this is for testing to make sure health is going down correctly
          if (player_1.health <= 0) {
            gameOver = true;
          }
        }
      }
    }

    for (let i = items.length - 1; i >= 0; i--) { // this controls collisions for the items, currently works with just health items
      let distance = dist(items[i].pos.x, items[i].pos.y, player_1.pos.x, player_1.pos.y);
      if (distance < items[i].r + player_1.r) {
        if (items[i] instanceof HealthItem) {
          player_1.increaseHealth();
          healthIndex++;
          items.splice(i, 1);
          continue;
        } else if (items[i] instanceof PowerUp) {
          if (items[i].getImage() == shieldBox) {
            player_1.shieldImmunity();
            items.splice(i, 1);
            continue;
          }
          if (items[i].getImage() == shotgunBox) {
            weapon = 1;
            player_1.powerUpTimer = POWERUP_DURATION;
            items.splice(i, 1);
            continue;
          }
          if (items[i].getImage() == laserBox) {
            weapon = 2;
            player_1.powerUpTimer = POWERUP_DURATION;
            items.splice(i, 1);
            continue;
          }
        } else if (items[i] instanceof ExitItem && game_mode == 'arcade') {
          player_1.is_exiting = true;
          weapon = 1;
          player_1.powerUpTimer = POWERUP_DURATION;
          items.splice(i, 1);
          continue;
        } else if (items[i] instanceof ExitItem && game_mode == 'story') {
          player_1.is_exiting = true; // starts the leave animation
          items.splice(i, 1);
          continue;
        }
      }

      if (items[i] && items[i].despawn) { // if item is still there, then despawn it
        items.splice(i, 1);
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

    // Wave logic (skip if player just died this frame — board can be empty)
    if (!gameOver && enemies.length === 0 && boss.length === 0) {
      if (game_mode === 'arcade') {
        if (arcade_wave > 0) {
          arcade_waves_survived++;
        }
        arcade_wave++;
        const waveConfig = getArcadeWaveConfig(arcade_wave);
        spawnRockBaddies(waveConfig.squadCount, waveConfig);
      } else if (wave_length !== 0) {
        spawnRockBaddies(8);
        wave_length--;
      } else {
        spawnBoss();
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
  for (let i = items.length - 1; i >= 0; i--) {
    items[i].draw();
    items[i].timer();
  }

  function distToSegment(px, py, ax, ay, bx, by) {
    let dx = bx - ax, dy = by - ay;
    let lenSq = dx * dx + dy * dy;
    let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
    t = constrain(t, 0, 1);
    let closestX = ax + t * dx;
    let closestY = ay + t * dy;
    return dist(px, py, closestX, closestY);
  }
  
  // Display health bar
  displayHealthBar(player_1);
}