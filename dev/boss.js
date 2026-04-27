class Boss {
    constructor(x, y, target_x, target_y, r, spritedata, spritesheet, Anispeed, moveSpeed, health, shootSpeed) {
        this.x = x;
        this.y = y;
        this.target_x = target_x;
        this.target_y = target_y;
        this.spritedata = spritedata;
        this.spritesheet = spritesheet;
        this.Anispeed = Anispeed;
        this.hit = false;
        this.r = r // this r is scaleable in comparisson to the enemy class for big bosses
        this.moveSpeed = moveSpeed;
        this.health = health;
        this.shootSpeed = shootSpeed;
        this.can_hit = true;
        this.is_visible = true;
        this.is_shooting = false; // this is so the boss doesn't shoot like 1000 bullets every frame
        this.is_dead = false; // this is so the boss' projectiles stop shooting when dead
        this.entered_scene = false; // this is so the boss can enter the scene

        this.Boss_anim = new BossSprite(spritedata, spritesheet, Anispeed, r * 2, r * 2);

        this.w = this.Boss_anim.width
        this.h = this.Boss_anim.height

        this.pos = createVector(x, y);
        this.vel = createVector(target_x - x, target_y - y);
        this.vel.setMag(3); // Speed
    }
}

class rockBoss extends Boss {
    constructor(x, y, target_x, target_y, r, spritedata, spritesheet, Anispeed, moveSpeed, health, shootSpeed) {
        super(x, y, target_x, target_y, r, spritedata, spritesheet, Anispeed, moveSpeed, health, shootSpeed)

    }

    update(player) {
        if (!paused && this.entered_scene) {
            this.shootPattern(player); // this will start the shooting cycle. the way this works is jank if need be ask me - Kai
        }
    }

    enterScene() { // THIS IS VERY IMPORTANT. THESE VALUES NEED TO BE CHANGED BASED ON WHERE THE BOSS IS ENTERING OR SUPPOSED TO BE. CHANGE THE Y OR X VARIABLES NEEDED.
        if (this.pos.x > this.target_x) {
            this.pos.x -= 5;
        } else {
            this.pos.x = this.target_x;
            this.entered_scene = true;
        }
    }

    draw() {
        if (this.is_visible === true) {
            fill(0, 0, 0);
            //circle(this.pos.x, this.pos.y, this.r * 2); // this is for showing the hitbox in testing.
            this.Boss_anim.show(this.pos.x - this.r, this.pos.y - this.r);
            if (this.entered_scene) {
                this.Boss_anim.animate();
            }
        }
    }

    async invincible() {
        this.can_hit = false;
        this.blink();
        console.log("cant hit me!");
        await delay(1000); // this is 1 seconds delay, change this and the for loop above to show change in blinking.
        this.can_hit = true;
    }

    async blink() { // this makes the boss blink when invincible
        for (let i = 0; i < 2; i++) { // until 5 because of the 2 delays and 1 second of i frames
            this.is_visible = false;
            await delay(100);
            this.is_visible = true;
            await delay(100);
        }
    }

    async shootPattern(player) {
        if (this.is_dead != true) {
            //shoots top to bottom
            let bottom = CANVAS_HEIGHT - 150;
            if (this.is_shooting) {
                return;
            }
            this.is_shooting = true;
            for (let i = 0; i <= bottom; i += 50) {
                projectiles.push(new Projectile(this.pos.x, this.pos.y, player.pos.x, i, "rockShooter"));
                await delay(100);
            }
            await delay(2000); // 2 second delay;
            if (this.is_dead) { // this is necessary after each call to stop the shooting if the enemy dies while shooting
                return;
            }
            // shoots bottom to top
            let top = 150;
            for (let i = CANVAS_HEIGHT; i >= top; i -= 50) {
                projectiles.push(new Projectile(this.pos.x, this.pos.y, player.pos.x, i, "rockShooter"));
                await delay(100);
            }
            await delay(2000)
            if (this.is_dead) {
                return;
            }
            // shoots middle area
            let center_top = (CANVAS_HEIGHT / 2) - 150;
            let center_bottom = (CANVAS_HEIGHT / 2) + 250;
            for (let i = center_top; i <= center_bottom; i += 20) {
                projectiles.push(new Projectile(this.pos.x, this.pos.y, player.pos.x, i, "rockShooter"));
                await delay(50);
            }
            await delay(2000);
            if (this.is_dead) {
                return;
            }
            // shoots from the low center to the middle
            let middle_bottom = (CANVAS_HEIGHT * 2);
            let middle = CANVAS_HEIGHT / 2;
            for (let i = middle_bottom; i >= middle; i -= 50) {
                projectiles.push(new Projectile(this.pos.x, this.pos.y, player.pos.x, i, "rockShooter"));
                await delay(50);
            }
            await delay(2000);
            if (this.is_dead) {
                return;
            }
            // shoots from the top center to the middle
            let top_middle = 0 - CANVAS_HEIGHT;
            for (let i = top_middle; i <= middle; i += 50) {
                projectiles.push(new Projectile(this.pos.x, this.pos.y, player.pos.x, i, "rockShooter"));
                await delay(50);
            }
            await delay(2000);
            this.is_shooting = false;
        }
    }
}

class EDMBoss extends rockBoss {
    constructor(x, y, target_x, target_y, r, spritedata, spritesheet, Anispeed, moveSpeed, health, shootSpeed) {
        super(x, y, target_x, target_y, r, spritedata, spritesheet, Anispeed, moveSpeed, 20, shootSpeed)

    }

    draw() {
        if (this.is_visible === true) {
            fill(0, 0, 0);
            //circle(this.pos.x, this.pos.y, this.r * 2); // this is for showing the hitbox in testing.
            this.Boss_anim.showOther(this.pos.x - this.r, this.pos.y - this.r);
            if (this.entered_scene) {
                this.Boss_anim.animate();
            }
        }
    }
}

class LofiBoss extends rockBoss {
    constructor(x, y, target_x, target_y, r, spritedata, spritesheet, Anispeed, moveSpeed, health, shootSpeed) {
        super(x, y, target_x, target_y, r, spritedata, spritesheet, Anispeed, moveSpeed, 15, shootSpeed) // for some reason his health isn't changing lol
    }

    draw() {
        if (this.is_visible === true) {
            fill(0, 0, 0);
            //circle(this.pos.x, this.pos.y, this.r * 2); // this is for showing the hitbox in testing.
            this.Boss_anim.showOther(this.pos.x - this.r, this.pos.y - this.r);
            if (this.entered_scene) {
                this.Boss_anim.animate();
            }
        }
    }
}