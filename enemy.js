
/**
 * Generic Enemy Type
 */
class Enemy {
    constructor(x, y, target_x, target_y, spritedata, spritesheet, Anispeed, moveSpeed, width, height) {
        this.x = x;
        this.y = y;
        this.target_x = target_x;
        this.target_y = target_y;
        this.spritedata = spritedata;
        this.spritesheet = spritesheet;
        this.Anispeed = Anispeed;
        this.hit = false;
        this.r = 30; // this is for collision detection, bascially an invisible hitbox
        this.moveSpeed = moveSpeed;

        this.Enemy_ani = new EnemySprite(spritedata, spritesheet, Anispeed, width, height);

        this.w = this.Enemy_ani.width;
        this.h = this.Enemy_ani.height;

        this.pos = createVector(x, y);
        this.vel = createVector(target_x - x, target_y - y);
        this.vel.setMag(moveSpeed); // Speed
        this.facingLeft = false;
  }

    draw() {
        if (this.hit) {
            fill("red");
            circle(this.pos.x, this.pos.y, 30); // this is currently for testing but works to show collisions
            this.hit = false;
        } else {
            // Dynamic sprite centering
            let drawX = this.pos.x - (this.Enemy_ani.width / 2)
            let drawY = this.pos.y - (this.Enemy_ani.height / 2)
            // console.log("x: ", drawX, "y: ", drawY);
            this.Enemy_ani.show(drawX, drawY, this.facingLeft);
            this.Enemy_ani.animate();
        }
    }
}

/**
 * Grunt class
 * This type of enemy will run bravely toward the player in attempts to hurt them
 */
class Grunt extends Enemy {
    // Constructor
    constructor(x, y, target_x, target_y, spritedata, spritesheet, Anispeed, moveSpeed) {
        super(x, y, target_x, target_y, spritedata, spritesheet, Anispeed, moveSpeed);

        this.Enemy_ani = new EnemySprite(spritedata, spritesheet, Anispeed, 60, 60);
        this.knockbackDirection = null;
    }

    // Update grunt to follow player each frame
    update(obj) {
        let direction = createVector(obj.pos.x - this.pos.x, obj.pos.y - this.pos.y);
    
        direction.setMag(this.moveSpeed); // change this to make the guy move faster
        
        // update left/right direction
        if (direction.x < 0) {
            this.facingLeft = true;
        } else if (direction.x > 0) {
            this.facingLeft = false;
        }
        
        // Stop enemy from moving when game is paused
        if (!paused) {
            if (this.knockbackDirection) {
                this.pos.add(this.knockbackDirection);
            } else {
                this.pos.add(direction);
            }
        }
    }

    knockback() {
        if (!this.knockbackDirection) {
            let directionToPlayer = createVector(0, 0);
            if (typeof player_1 !== "undefined" && player_1) {
                directionToPlayer = createVector(player_1.pos.x - this.pos.x, player_1.pos.y - this.pos.y);
            }
            this.knockbackDirection = directionToPlayer.copy().mult(-1).setMag(this.moveSpeed * 35); //change the number at the end for how far the knockback goes
            
            // stop knockback after a frame
            setTimeout(() => {
                this.knockbackDirection = null;
            }, 1000 / frameRate());
        }
    }
}

/**
 * Shooter class
 * Shoots at the player while evading projectiles.
 */
class Shooter extends Enemy {
    // Constructor 
    constructor(x, y, target_x, target_y, spritedata, spritesheet, Anispeed, moveSpeed,
        shootSpeed // Sets the shoot speed that that shooter will use to attack the player. Higher = Slower! 
    ) {
        super(x, y, target_x, target_y, spritedata, spritesheet, Anispeed, moveSpeed);
        this.r = 110;
        this.Enemy_ani = new EnemySprite(spritedata, spritesheet, Anispeed, 100, 130);
        this.shootSpeed = shootSpeed;

        // Construct a random angle for random movement
        // https://p5js.org/reference/p5/TWO_PI/
        // https://p5js.org/reference/p5/random/
        this.wanderAngle = random(TWO_PI); // 2*pi = radius of a circle

        // Create a random number to randomize the shooting interval between shooter enemies
        // Number is between 0 and shootSpeed
        this.shootSeed = Math.floor(Math.random() * shootSpeed);

        
    }

    // Update Shooter each frame
    update(obj) {
        this.evasiveMovement(obj);
        // Shoot the player every shootSpeed frames
        if ((frameCount + this.shootSeed) % this.shootSpeed == 0) {
            projectiles.push(new Projectile(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y, "rockShooter"));
        }
    }

    // Override draw to not draw the last frame
    draw() {
        if (this.hit) {
            fill("red");
            circle(this.pos.x, this.pos.y, 30); // this is currently for testing but works to show collisions
            this.hit = false;
        } else {
            this.Enemy_ani.showAllButLast(this.pos.x - 50, this.pos.y - 60, this.facingLeft); // these positions are dependant on the size of the sprite, change that, change these
            this.Enemy_ani.animate();
        }
    }

    // LLM-Assisted movement for shooter class
    evasiveMovement(obj) {
        // Stop enemy movement if paused
        if (paused)
            return;

        let moveDirection = createVector(0, 0); // Movement direction
        let closestDist = Infinity;             // Distance to closest projectile
        let closestProj = null;                 // Detected closest projectile
        let detectionRadius = 150;              // Distance to start evading projectiles in 

        // Loop through projectiles to check for evasive maneuvers
        for (let i = 0; i < projectiles.length; i++) {
            let proj = projectiles[i]; 

            // if the projectile is from the player (thus is harmful to this enemy)
            if(proj.playType == "player") {
                // Calculate distance from enemy to projectile
                let d = dist(this.pos.x, this.pos.y, proj.pos.x, proj.pos.y);

                // If it's in the detection radius, it may be a new closest projectile to avoid
                if (d < detectionRadius && d < closestDist) {
                    closestDist = d;
                    closestProj = proj;
                }
            }
        } 

        // If there is a projectile to evade 
        // May have to change later if projectile doesn't switch to NULL
        if (closestProj != null) {
            moveDirection = createVector(this.pos.x - closestProj.pos.x, this.pos.y - closestProj.pos.y);
        } else {
            // No projectiles around, wonder around the level
            this.wanderAngle += random(-0.2, 0.2); // Adjust direction slowly
            moveDirection = p5.Vector.fromAngle(this.wanderAngle);

        }

        // Prevent enemy from wandering off screen
        let margin = 50;
        if (this.pos.x < margin)
            moveDirection.x = abs(moveDirection.x);
        if (this.pos.x > CANVAS_WIDTH - margin)
            moveDirection.x = -abs(moveDirection.x);
        if (this.pos.y < margin)
            moveDirection.y = abs(moveDirection.y);
        if (this.pos.y > CANVAS_HEIGHT - margin)
            moveDirection.y = -abs(moveDirection.y);

        // Update angle to match bounded direction
        this.wanderAngle = moveDirection.heading();

        // update left/right direction
        if (moveDirection.x < 0) {
            this.facingLeft = true;
        } else if (moveDirection.x > 0) {
            this.facingLeft = false;
        }

        // Apply the movement
        moveDirection.setMag(this.moveSpeed);
        this.pos.add(moveDirection);
    }
}

/**
 * Bomber class
 * Attempts to walk up to the player and explodes when within range.
 */
class Bomber extends Enemy {
    // Constructor
    constructor(x, y, target_x, target_y, spritedata, spritesheet, Anispeed, moveSpeed) {
        super(x, y, target_x, target_y, spritedata, spritesheet, Anispeed, moveSpeed);

        this.Enemy_ani = new EnemySprite(spritedata, spritesheet, Anispeed, 55, 70);
        this.exploded = false;
    }

    // Update bomber to follow player each frame
    update(obj) {
        let direction = createVector(obj.pos.x - this.pos.x, obj.pos.y - this.pos.y);
    
        direction.setMag(this.moveSpeed); // change this to make the guy move faster
        
        // Stop enemy from moving when game is paused or when exploded
        if (!(paused || this.exploded)) {
            this.pos.add(direction);
        }
    }

    async explode() {
        if (!this.exploded) {
            this.exploded = true;
            this.r = 75;
            this.Enemy_ani = new EnemySprite(eleExplodeData, eleExplodeSprite, 0.1, 150, 150);
            // Wait a bit before removing the enemy
            // Found the timing to play the spritesheet once through trial and error
            await sleep(700);

            // An AI told me this was a thing in JS, neat! 
            let currentIndex = enemies.indexOf(this);

            enemies.splice(currentIndex, 1);
        }
    }
}