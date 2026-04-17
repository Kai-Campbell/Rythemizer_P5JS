
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
    show(x, y, facingLeft = false) {
        let index = floor(this.index) % this.len;
        if (facingLeft) {
            push();
            translate(x + 20, y + 20);
            scale(-1, 1);
            image(this.animation[index], -20, -20, 40, 40);
            pop();
        } else {
            image(this.animation[index], x, y, 40, 40);
        }
    }
    
    /**
     * Renders every frame except the last.
     * Useful for when the last sprite is special, like when the enemy is taking damage.
     */
    showAllButLast(x, y, facingLeft = false) {
        let index = floor(this.index) % this.len;
        if (index == this.len - 1) {
            // Reach second to last frame, reset index to 0;
            index = 0;
        }
        if (facingLeft) {
            push();
            translate(x + 20, y + 20);
            scale(-1, 1);
            image(this.animation[index], -20, -20, 40, 40);
            pop();
        } else {
            image(this.animation[index], x, y, 40, 40);
        }
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

    show(x, y, facingLeft = false) {
        let index = floor(this.index) % this.len;
        let isLastFrame = (index == this.len - 1);
        let width = isLastFrame ? 695 : 440;
        let height = 600;
        let xOffset = isLastFrame ? -255 : 0;
        
        if (facingLeft) {
            push();
            translate(x + xOffset + width / 2, y + height / 2);
            scale(-1, 1);
            image(this.animation[index], -width / 2, -height / 2, width, height);
            pop();
        } else {
            image(this.animation[index], x + xOffset, y, width, height);
        }
    }

    animate() {
        this.index += this.speed
    }
}

class EnemySprite extends Sprite {
    constructor(spritedata, spritesheet, speed, width, height) {
        super(spritedata, spritesheet, speed);

        this.width = width;
        this.height = height;
        // center is a boolean which renders the sprite relative to the center of the cords
    }

    show(x, y, facingLeft = false) {
        let index = floor(this.index) % this.len;
        if (facingLeft) {
            push();
            translate(x + this.width / 2, y + this.height / 2);
            scale(-1, 1);
            image(this.animation[index], -this.width / 2, -this.height / 2, this.width, this.height);
            pop();
        } else {
            image(this.animation[index], x, y, this.width, this.height);
        }
    }

    animate() {
        this.index += this.speed
    }

    showAllButLast(x, y, facingLeft = false) {
        let index = floor(this.index) % this.len;
        if (index == this.len - 1) {
            // Reach second to last frame, reset index to 0;
            index = 0;
        }
        if (facingLeft) {
            push();
            translate(x + this.width / 2, y + this.height / 2);
            scale(-1, 1);
            image(this.animation[index], -this.width / 2, -this.height / 2, this.width, this.height);
            pop();
        } else {
            image(this.animation[index], x, y, this.width, this.height);
        }
    }
}