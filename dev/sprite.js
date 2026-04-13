
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
        this.len = this.animation.length; // Number of frames in the sprite-sheet
        this.index = 0;
    }
    
    /**
     * Renders the sprite. 
     */
    show(x, y) {
        let index = floor(this.index) % this.len;
        image(this.animation[index], x, y, 40, 40);
    }
    
    /**
     * Renders every frame except the last.
     * Useful for when the last sprite is special, like when the enemy is taking damage.
     */
    showAllButLast(x, y) {
        let index = floor(this.index) % this.len;
        if (index == this.len - 1) {
            // Reach second to last frame, reset index to 0;
            index = 0;
        } 
        image(this.animation[index], x, y, 40, 40);

    }

    /**
     * Increment index to display different frames in show()
     */
    animate() {
        this.index += this.speed
    }

    flip() {
        let index = floor(this.index) % this.len;
        scale(-1, -1);
        image(this.animation[index], x, y, 40, 40);
    }
}

class BossSprite extends Sprite {
    constructor(spritedata, spritesheet, speed, width, height) {
        super(spritedata, spritesheet, speed);

        this.width = width;
        this.height = height;
    }

    show(x, y) {
        let index = floor(this.index) % this.len;
        image(this.animation[index], x, y, this.width, this.height);
    }

    animate() {
        this.index += this.speed
    }
}