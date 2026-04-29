
class Projectile {
    constructor(x, y, targetX, targetY, playType) {
    this.playType = playType // string that determines the type of projectile being shot 
    this.pos = createVector(x, y); // Calculate direction vector
    this.vel = createVector(targetX - x, targetY - y);
    this.vel.setMag(8); // Speed
    this.w = 20
    this.h = 20 // I'm gonna be honest I think this isn't needed but I'm leaving it here in case because I forgot, just in case DO NOT REMOVE IT I WILL CHECK IT LATER
    this.r = 10
    this.frameCounter = 0; // Counter for sprite animation
    this.laserShot = false;
  }

    // update position of projectile every frame
    update() {
        if (!paused && weapon == 2 && this.playType === 'player') {
            this.frameCounter++;
            this.laserShot = true;
        }

        if (!paused && (weapon != 2 || this.playType !== 'player')) {
            this.frameCounter++;
            this.pos.add(this.vel);
        }
    }

    display() {
        // Player bullets
        if (this.playType == "player") {
            // fill(255);
            // noStroke();
            // ellipse(this.pos.x, this.pos.y, 20, 20);
            
            let angle = atan2(this.vel.y, this.vel.x);
            let spriteIndex = Math.floor(millis() / 100) % 2;

            // Get the frame position from json
            if (weapon == 0) {
                let frame = bulletData.frames[spriteIndex].position;

                push();
                translate(this.pos.x, this.pos.y);
                rotate(angle);
                image(
                    bullet,             // Actual sprite sheet file 
                    -10, -10,               // dx, dy: Coordinates to draw image onto canvas 
                    30, 20,             // dWidth, dHeight: How large it draws onto the canvas
                    frame.x, frame.y,   // sx, xy: Where to start cropping on the sprite sheet
                    frame.w, frame.h    // sWidth, sHeight: Exact width and height to crop from sprite sheet
                );
                pop();
            }

            if (weapon == 1) {
                let frame = bulletData.frames[spriteIndex].position;
                
                const spacing = 10; // Adjust this to control gap between bullets
                
                // Perpendicular offset (normal vector rotated 90° from travel direction)
                const offsetX = Math.cos(angle + Math.PI / 2) * spacing;
                const offsetY = Math.sin(angle + Math.PI / 2) * spacing;

                // offset to the left
                push();
                translate(this.pos.x - offsetX, this.pos.y - offsetY);
                rotate(angle);
                image(fastBullet, -10, -10, 30, 20, frame.x, frame.y, frame.w, frame.h);
                pop();

                // offset to the right
                push();
                translate(this.pos.x + offsetX, this.pos.y + offsetY);
                rotate(angle);
                image(fastBullet, -10, -10, 30, 20, frame.x, frame.y, frame.w, frame.h);
                pop();
            }

            if (weapon == 2) {
                let frame = laserPinkData.frames[spriteIndex].position;

                push();
                translate(this.pos.x, this.pos.y);
                rotate(angle);
                image(
                    laserPink,             // Actual sprite sheet file 
                    -10, -10,               // dx, dy: Coordinates to draw image onto canvas 
                    495 * 0.50, 125 * 0.50,             // dWidth, dHeight: How large it draws onto the canvas
                    frame.x, frame.y,   // sx, xy: Where to start cropping on the sprite sheet
                    frame.w, frame.h    // sWidth, sHeight: Exact width and height to crop from sprite sheet
                );
                pop();
            }

            if (weapon == 3) {
                let frame = vinylGreenData.frames[spriteIndex].position;

                push();
                translate(this.pos.x, this.pos.y);
                rotate(angle);
                image(
                    vinylGreen,             // Actual sprite sheet file 
                    -10, -10,               // dx, dy: Coordinates to draw image onto canvas 
                    30, 20,             // dWidth, dHeight: How large it draws onto the canvas
                    frame.x, frame.y,   // sx, xy: Where to start cropping on the sprite sheet
                    frame.w, frame.h    // sWidth, sHeight: Exact width and height to crop from sprite sheet
                );
                pop();
            }
        }
        // Rock shooter projectiles, uses fireball sprite
        if (this.playType == "rockShooter") {
            // fill(255);
            // noStroke();
            // ellipse(this.pos.x, this.pos.y, 20, 20);
            
            let angle = atan2(this.vel.y, this.vel.x);
            let spriteIndex = Math.floor(millis() / 100) % 2;

            // Get the frame position from json
            let frame = fireballData.frames[spriteIndex].position;
            
            push();
            translate(this.pos.x, this.pos.y);
            rotate(angle);
            image(
                fireballSheet,      // Actual sprite sheet file 
                0 - 10, 0 - 10,     // dx, dy: Coordinates to draw image onto canvas (10 to center sprite)
                20, 28,             // dWidth, dHeight: How large it draws onto the canvas
                frame.x, frame.y,   // sx, xy: Where to start cropping on the sprite sheet
                frame.w, frame.h    // sWidth, sHeight: Exact width and height to crop from sprite sheet
            );
            pop();
        }

        if (this.playType == "edmShooter") {
            // fill(255);
            // noStroke();
            // ellipse(this.pos.x, this.pos.y, 20, 20);
            
            let angle = atan2(this.vel.y, this.vel.x);
            let spriteIndex = Math.floor(millis() / 100) % 2;

            // Get the frame position from json
            let frame = fireballData.frames[spriteIndex].position;
            
            push();
            translate(this.pos.x, this.pos.y);
            rotate(angle);
            image(
                vinylPink,      // Actual sprite sheet file 
                0 - 10, 0 - 10,     // dx, dy: Coordinates to draw image onto canvas (10 to center sprite)
                20, 28,             // dWidth, dHeight: How large it draws onto the canvas
                frame.x, frame.y,   // sx, xy: Where to start cropping on the sprite sheet
                frame.w, frame.h    // sWidth, sHeight: Exact width and height to crop from sprite sheet
            );
            pop();
        }

        if (this.playType == "lofiBoss") {
            // fill(255);
            // noStroke();
            // ellipse(this.pos.x, this.pos.y, 20, 20);
            
            let angle = atan2(this.vel.y, this.vel.x);
            let spriteIndex = Math.floor(millis() / 100) % 2;

            // Get the frame position from json
            let frame = fireballData.frames[spriteIndex].position;
            
            push();
            translate(this.pos.x, this.pos.y);
            rotate(angle);
            image(
                quarterNote,      // Actual sprite sheet file 
                0 - 10, 0 - 10,     // dx, dy: Coordinates to draw image onto canvas (10 to center sprite)
                20, 28,             // dWidth, dHeight: How large it draws onto the canvas
                frame.x, frame.y,   // sx, xy: Where to start cropping on the sprite sheet
                frame.w, frame.h    // sWidth, sHeight: Exact width and height to crop from sprite sheet
            );
            pop();
        }

        if (this.playType == "edmBoss") {
            // fill(255);
            // noStroke();
            // ellipse(this.pos.x, this.pos.y, 20, 20);
            
            let angle = atan2(this.vel.y, this.vel.x);
            let spriteIndex = Math.floor(millis() / 100) % 2;

            // Get the frame position from json
            let frame = fireballData.frames[spriteIndex].position;
            
            push();
            translate(this.pos.x, this.pos.y);
            rotate(angle);
            image(
                hypnoWaveSheet,      // Actual sprite sheet file 
                0 - 10, 0 - 10,     // dx, dy: Coordinates to draw image onto canvas (10 to center sprite)
                20, 28,             // dWidth, dHeight: How large it draws onto the canvas
                frame.x, frame.y,   // sx, xy: Where to start cropping on the sprite sheet
                frame.w, frame.h    // sWidth, sHeight: Exact width and height to crop from sprite sheet
            );
            pop();
        }
    }

    isOffScreen() {
        return (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height);
    }

    isDone() {
        if (this.playType === "player" && weapon == 2) {
            return this.frameCounter >= LASER_DURATION;
        }
        return this.isOffScreen();
    }

    checkHit(target) {
        //circle(this.pos.x, this.pos.y, this.r) // this is for testing rn
        let distance = dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
        if (distance < target.r + this.r) { // if the 2 raidus' collide
            target.hit = true; // every enemy needs to have this variable
            return true;
        }
        return false;
    }

    // Returns the type of the projectile
    getPlayType() {
        return this.playType;
    }

    /*
    insert these into the level so the class will work
    *put this in the draw function
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].update();
        projectiles[i].display();
    }
    
    function mousePressed() {
        projectiles.push(new Projectile(player_x, player_y, mouseX, mouseY));
    }
    */
}