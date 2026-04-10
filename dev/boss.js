class Boss {
    constructor(x, y, target_x, target_y, r, spritedata, spritesheet, Anispeed, moveSpeed) {
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

        this.Enemy_ani = new Sprite(spritedata, spritesheet, Anispeed);

        this.w = this.Enemy_ani.width
        this.h = this.Enemy_ani.height

        this.pos = createVector(x, y);
        this.vel = createVector(target_x - x, target_y - y);
        this.vel.setMag(3); // Speed
    }
}