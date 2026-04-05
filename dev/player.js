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

    this.player_ani = new Sprite(spritedata, spritesheet, Anispeed);

    this.w = this.player_ani.width // these are needed for hit detections
    this.h = this.player_ani.height // these are needed for hit detections
    
    this.speed = 4;
    this.pos = createVector(x, y); // this is for tracking for the enemies and bosses
  }
  
  update() {
    let mvmt = createVector(0, 0);
    
    if(pressedKeys.a) {
      mvmt.x -= 1;
    }
    if(pressedKeys.d) {
      mvmt.x += 1;
    }
    if(pressedKeys.w) {
      mvmt.y -= 1;
    }
    if(pressedKeys.s) {
      mvmt.y += 1;
    }
    
    if (mvmt.mag() > 0) {
      mvmt.setMag(this.speed);
    }
    
    this.x += mvmt.x;
    this.y += mvmt.y;

    this.pos.set(this.x, this.y)
  }
  
  draw() {
    this.player_ani.show(this.x - 20, this.y - 20); // temporary fix probably should change properly
    this.player_ani.animate();
  }
}


