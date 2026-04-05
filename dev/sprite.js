
class Sprite {
    constructor(spritedata, spritesheet, speed) {
        this.animation = []
        this.spritedata = spritedata;
        this.spritesheet = spritesheet;
        let frames = spritedata.frames;
        this.width; // width variable used for collision detection
        this.height; // height variable used for collision detection
        for (let i = 0; i < frames.length; i++) {
            let pos = frames[i].position;
            let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h)
            this.animation.push(img);
            this.width = pos.w
            this.height = pos.h
        }
        this.speed = speed;
        this.len = this.animation.length;
        this.index = 0;
    }
    
    show(x, y) {
        let index = floor(this.index) % this.len;
        image(this.animation[index], x, y, 40, 40);
    }

    animate() {
        this.index += this.speed
    }

    flip() {
        let index = floor(this.index) % this.len;
        scale(-1, -1);
        image(this.animation[index], x, y, 40, 40);
    }
}