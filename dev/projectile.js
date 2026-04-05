class Projectile {
    constructor(x, y, targetX, targetY, playType) {
    this.playType = playType // string 
    this.pos = createVector(x, y); // Calculate direction vector
    this.vel = createVector(targetX - x, targetY - y);
    this.vel.setMag(8); // Speed
    this.w = 20
    this.h = 20 // I'm gonna be honest I think this isn't needed but I'm leaving it here in case because I forgot, just in case DO NOT REMOVE IT I WILL CHECK IT LATER
    this.r = 10
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

    checkHit(target) {
        let distance = dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
        if (distance < target.r + this.r) {
            target.hit = true; // every enemy needs to have this variable
            return true;
        }
        return false;
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