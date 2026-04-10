let player;

let spriteImages = [];
let pressedKeys = {};

class Player {
  constructor(x, y, spritedata, spritesheet, Anispeed) {
    this.x = x;
    this.y = y;
    this.spritedata = spritedata;
    this.spritesheet = spritesheet;
    this.Anispeed = Anispeed;
    this.r = 40 // if the scale is changed, change this
    this.health = 5

    this.player_ani = new Sprite(spritedata, spritesheet, Anispeed);

    this.w = this.player_ani.width // these are needed for hit detections
    this.h = this.player_ani.height // these are needed for hit detections
    
    this.speed = 4;
    this.pos = createVector(x, y); // this is for tracking for the enemies and bosses and moving
  }
  
  update() {
    let mvmt = createVector(0, 0);
    
    // Player movement
    if (!paused) { // Disables player from moving when pause menu is open
      if(pressedKeys.a || pressedKeys.A || pressedKeys.ArrowLeft) {
        if (this.x > 0) {
          mvmt.x -= 1;
        }
      }
      if(pressedKeys.d || pressedKeys.D || pressedKeys.ArrowRight) {
        if (this.x < CANVAS_WIDTH - this.w) {
          mvmt.x += 1;
        }
      }
      if(pressedKeys.w || pressedKeys.W || pressedKeys.ArrowUp) {
        if (this.y > 0) {
          mvmt.y -= 1;
        }
      }
      if(pressedKeys.s || pressedKeys.S || pressedKeys.ArrowDown) {
        if (this.y < CANVAS_HEIGHT - this.h) {
          mvmt.y += 1;
        }
      }

      if (typeof gamepadInput !== "undefined") {
        const gs = gamepadInput.leftStick;
        if (Math.abs(gs.x) > 0 || Math.abs(gs.y) > 0) {
          mvmt.x += gs.x;
          mvmt.y += gs.y;
        }
        const pad = gamepadInput.dpad;
        if (pad.left) mvmt.x -= 1;
        if (pad.right) mvmt.x += 1;
        if (pad.up) mvmt.y -= 1;
        if (pad.down) mvmt.y += 1;
      }
    }
    
    if (mvmt.mag() > 0) {
      mvmt.setMag(this.speed);
    }
    
    this.x += mvmt.x;
    this.y += mvmt.y;

    this.x = constrain(this.x, 0, CANVAS_WIDTH - this.w);
    this.y = constrain(this.y, 0, CANVAS_HEIGHT - this.h);

    this.pos.set(this.x, this.y)
  }
  
  draw() {
    this.player_ani.show(this.x - 20, this.y - 20); // temporary fix probably should change properly
    this.player_ani.animate();
  }
/*
  drawGun() {
    let angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x);
    let aimingLeft = abs(angle) > HALF_PI;

    noStroke();
    fill(90, 140, 230);
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    if (aimingLeft) scale(1, -1);
    fill(160, 160, 170);
    rect(RADIUS - 4, -4, 28, 9, 2);
  }
*/
}


