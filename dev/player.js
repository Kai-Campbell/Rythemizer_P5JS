let player;
const delay = ms => new Promise(res => setTimeout(res, ms)); // this helps with the delay functions DO NOT REMOVE also this is declare globally so dont add to other classes
let spriteImages = [];
let pressedKeys = {};
let weapon = 0;
let powerUpTimer;
const POWERUP_DURATION = 600;
this.isMoving = false;

class Player {
  constructor(x, y, spritedata, spritesheet, Anispeed) {
    this.x = x;
    this.y = y;
    this.spritedata = spritedata;
    this.spritesheet = spritesheet;
    this.Anispeed = Anispeed;
    this.r = 40 // if the scale is changed, change this
    this.health = 5; 
    this.can_hit = true;
    this.is_visible = true;
    this.is_rolling = false;
    this.powerUpTimer = 0;

    this.is_entering = true; // true
    this.is_exiting = false;

    this.player_ani = new Sprite(spritedata, spritesheet, Anispeed);
    this.roll_animation = new Sprite(rollJSON, rollspritesheet, 0.2)

    this.w = this.player_ani.width // these are needed for hit detections
    this.h = this.player_ani.height // these are needed for hit detections
    
    this.speed = 4;
    this.pos = createVector(x, y); // this is for tracking for the enemies and bosses and moving
    this.facingLeft = false;
  }
  
  update() {
    let mvmt = createVector(0, 0);

    // Power Up Timer
    if (weapon != 0) {
        if (this.powerUpTimer > 0) {
            this.powerUpTimer--;
        }
        if (this.powerUpTimer <= 0) {
            weapon = 0;
        }
    }
    
    // Player movement
    if (!paused && !this.is_entering && !this.is_exiting) { // Disables player from moving when pause menu is open
      if((pressedKeys.a || pressedKeys.A || pressedKeys.ArrowLeft) && !this.is_rolling) {
        if (this.x > 0) {
          mvmt.x -= 1;
        }
      }
      if((pressedKeys.d || pressedKeys.D || pressedKeys.ArrowRight) && !this.is_rolling) {
        if (this.x < CANVAS_WIDTH - this.w) {
          mvmt.x += 1;
        }
      }
      if((pressedKeys.w || pressedKeys.W || pressedKeys.ArrowUp) && !this.is_rolling) {
        if (this.y > 0) {
          mvmt.y -= 1;
        }
      }
      if((pressedKeys.s || pressedKeys.S || pressedKeys.ArrowDown) && !this.is_rolling) {

        if (this.y < CANVAS_HEIGHT - this.h) {
          mvmt.y += 1;
        }
      }

      

      if (keyIsDown(32) && !this.is_rolling) {
        console.log("im here")
        this.roll()
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
      // update left/right direction
      this.isMoving = true;
      if (mvmt.x < 0) {
        this.facingLeft = true;
      } else if (mvmt.x > 0) {
        this.facingLeft = false;
      }
    } else {
      this.isMoving = false;
    }

    if(this.is_rolling) {
        if (this.facingLeft) {
          mvmt.x -= 7; //change these for how far player goes
        } else { 
          mvmt.x += 7;
        }
      }
    
    this.x += mvmt.x;
    this.y += mvmt.y;
    if (!this.is_entering && !this.is_exiting) {
      this.x = constrain(this.x, 0, CANVAS_WIDTH - this.w);
      this.y = constrain(this.y, 0, CANVAS_HEIGHT - this.h);
    }
    
    this.pos.set(this.x, this.y)
  }

  async roll(){  // this method is kinda jank so it might need further testing, only can roll when no i frames are present because it makes it buggy otherwise
    if (this.is_rolling || !this.can_hit) {
      return;
    }

    this.is_rolling = true
    this.can_hit = false
    this.roll_animation.index = 0

    await delay(475); //change for duration of roll

    this.is_rolling = false
    if (this.is_visible) {
      this.can_hit = true
    }
  }

  
  draw() {
    if (this.is_visible === true) {
      //circle(this.pos.x, this.pos.y, this.r) // here for testing if needed.
      if (this.isMoving) {
        this.player_ani.showFrame(this.pos.x - 20, this.pos.y - 20, this.facingLeft, 3, 6);
        this.player_ani.animateRange(3, 6);
      } else {
        this.player_ani.showFrame(this.pos.x - 20, this.pos.y - 20, this.facingLeft, 0, 0);
      }
      if (this.is_rolling) {
        this.roll_animation.showFrame(this.pos.x - 20, this.pos.y - 20, this.facingLeft, 0, 3);
        this.roll_animation.animateRange(0, 3);
      }
      // Aim gun with the right stick when available, otherwise use the mouse.
      let aimX = mouseX - this.pos.x;
      let aimY = mouseY - this.pos.y;
      if (typeof gamepadInput !== "undefined") {
        const rs = gamepadInput.rightStick;
        if (Math.hypot(rs.x, rs.y) > 0.2) {
          aimX = rs.x;
          aimY = rs.y;
        }
      }
      let angle = atan2(aimY, aimX);
      push();
      translate(this.pos.x, this.pos.y);
      rotate(angle);
      if (weapon == 0) {
        image(pistolSprite, 0, 0, 65 * .75, 40 * .75);
      }
      if (weapon == 1) {
        let shouldDraw = true;
        if (this.powerUpTimer < 180) {
          let blinkRate = this.powerUpTimer < 60 ? 6 : 15;
          shouldDraw = (frameCount % blinkRate < blinkRate / 2);
        }
        if (shouldDraw) {
          image(shotgunSprite, 0, 0, 85 * .75, 45 * .75);
        }
      }
      if (weapon == 2) {
        let shouldDraw = true;
        if (this.powerUpTimer < 180) {
          let blinkRate = this.powerUpTimer < 60 ? 6 : 15;
          shouldDraw = (frameCount % blinkRate < blinkRate / 2);
        }
        if (shouldDraw) {
          image(laserSprite, 0, 0, 120 * .50, 107 * .50);
        }
      }
      if (weapon == 3) {
        let shouldDraw = true;
        if (this.powerUpTimer < 180) {
          let blinkRate = this.powerUpTimer < 60 ? 6 : 15;
          shouldDraw = (frameCount % blinkRate < blinkRate / 2);
        }
        if (shouldDraw) {
          image(discThrowerSprite, 0, 0, 120 * .75, 50 * .75);
        }
      }
      pop();
    }
  }

  async blink() { // this makes the character blink when invincible
    for (let i = 0; i < 15; i++) { // until 15 because of the 2 delays and 3 seconds of i frames
      this.is_visible = false;
      await delay(100);
      this.is_visible = true;
      await delay(100);
    }
  }

  async invincible() {
    if (this.is_rolling) {
      return;
    }
    this.can_hit = false;
    this.blink();
    console.log("cant hit me!");
    await delay(3000); // this is 3 seconds delay, change this and the for loop above to show change in blinking.
    this.can_hit = true;
  }

  increaseHealth() { // this is so the players health doesn't go above 5 after health items were added
    // play health SFX
    playSFX("healthUp");
    if (this.health >= 5) {
      return;
    } else {
      this.health++;
    }
  }

  async shieldImmunity() {
    this.can_hit = false;
    console.log("cant hit me!");
    // shield animation here
    await delay(8000); // this is 3 seconds delay, change this and the for loop above to show change in blinking.
    this.can_hit = true;
  }

  leaveScene(newLevel) {
    if (!this.is_exiting) {
      return;
    }
    this.y -= 5
    this.pos.y = this.y;
    if (this.y <= -150) {
      this.is_exiting = false;
      switchLevel(newLevel);
    }
  }

  enterScene() {
    if (!this.is_entering) {
      return;
    }
    this.y += 5
    this.pos.y = this.y;
    if (this.y >= 300) {
      this.is_entering = false;
    }
  }

  // these 2 functions are specifically for the ending scene

  justShow(sizeW, sizeH) {
    this.player_ani.showAdjustable(this.pos.x - 20, this.pos.y - 20, this.facingLeft, sizeW, sizeH);
  }

  enterEndScene(stop_pos) {
    if (!this.is_entering) {
      return;
    }
    this.y += 5
    this.pos.y = this.y;
    if (this.y >= stop_pos) {
      this.is_entering = false;
    }
  }
}


