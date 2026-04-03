
class Sprite {
    constructor(spritedata, spritesheet, speed) {
        this.animation = []
        this.spritedata = spritedata;
        this.spritesheet = spritesheet;
        let frames = spritedata.frames;
        for (let i = 0; i < frames.length; i++) {
            let pos = frames[i].position;
            let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h)
            this.animation.push(img);
        }
        this.speed = speed;
        this.len = this.animation.length;
        this.index = 0;
    }
    
    show(x, y) {
        let index = floor(this.index) % this.len;
        image(this.animation[index], x, y);
    }

    animate() {
        this.index += this.speed
    }
}