class Enemy {
    constructor(x, y, target_x, target_y, spritedata, spritesheet, Anispeed) {
        this.x = x;
        this.y = y;
        this.target_x = target_x;
        this.target_y = target_y;
        this.spritedata = spritedata;
        this.spritesheet = spritesheet;
        this.Anispeed = Anispeed;

        this.Enemy_ani = new Sprite(spritedata, spritesheet, Anispeed);
    }
}