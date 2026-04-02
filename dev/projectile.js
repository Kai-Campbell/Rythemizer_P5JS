class Projectile {
    constructor(x, y, targetX, targetY, playType) {
    this.playType = playType
    this.pos = createVector(x, y);
    // Calculate direction vector
    this.vel = createVector(targetX - x, targetY - y);
    this.vel.setMag(8); // Speed
  }
  
    update() {
        this.pos.add(this.vel);
    }

    display() {
        if (this.playType == "player") {
            fill(255);
            noStroke();
            ellipse(this.pos.x, this.pos.y, 20, 20);
            image(bullet, this.pos.x, this.pos.y, 50, 25, 90)
        }
    }

    isOffScreen() {
        return (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height);
    }

    /*
    isHitting() {
        
    }
    */

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