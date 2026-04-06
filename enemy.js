class Enemy {
    constructor(x, y, target_x, target_y, spritedata, spritesheet, Anispeed, moveSpeed) {
        this.x = x;
        this.y = y;
        this.target_x = target_x;
        this.target_y = target_y;
        this.spritedata = spritedata;
        this.spritesheet = spritesheet;
        this.Anispeed = Anispeed;
        this.hit = false;
        this.r = 30 // this is for collision detection, bascially an invisible hitbox
        this.moveSpeed = moveSpeed

        this.Enemy_ani = new Sprite(spritedata, spritesheet, Anispeed);

        this.w = this.Enemy_ani.width
        this.h = this.Enemy_ani.height

        this.pos = createVector(x, y);
        this.vel = createVector(target_x - x, target_y - y);
        this.vel.setMag(3); // Speed
  }

    update(obj) {
        let direction = createVector(obj.pos.x - this.pos.x, obj.pos.y - this.pos.y);
    
        direction.setMag(this.moveSpeed); // change this to make the guy move faster
        
        // Stop enemy from moving when game is paused
        if (!paused) {
            this.pos.add(direction);
        }
    }

    draw() {
        if (this.hit) {
            fill("red");
            circle(this.pos.x, this.pos.y, 30); // this is currently for testing but works to show collisions
            this.hit = false;
        } else {
            this.Enemy_ani.show(this.pos.x - 20, this.pos.y - 20);
            this.Enemy_ani.animate();
        }
    }
}