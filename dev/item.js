class Item {
    constructor(image, x, y) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.r = 20;
        this.despawn = false;
        this.is_visible = true;
        this.pos = createVector(x, y); // this is used for collisions
    }

    draw() {
        if (this.is_visible) {
            image(this.image, this.x - 10, this.y - 10, 40, 30);
        }
    }

    async timer() {
        await delay(5000); // 5 seconds
        this.blink();
        await delay(3000); // 3 seconds of blinking
        this.despawn = true;
    }

    async blink() {
        for (let x = 0; x < 10; x++) {
            this.is_visible = false;
            await delay(200);
            this.is_visible = true;
            await delay(200);
        }
        for (let x = 0; x < 10; x++) {
            this.is_visible = false;
            await delay(50);
            this.is_visible = true;
            await delay(50);
        }
    }
}

class HealthItem extends Item {
    constructor(image, x, y) {
        super(image, x, y)
    }
}

class PowerUp extends Item {
    constructor(image, x, y) {
        super(image, x, y)
    }
}

class ExitItem extends Item {
    constructor(image, x, y) {
        super(image, x, y)
    }

    async timer() { // this function will make it so the level transition doesn't despawn
        return;
    }
}