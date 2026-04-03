let player;

let spriteImages = [];
let pressedKeys = {};

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    
    this.speed = 4;
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
  }
  
  draw() {
    //let point = atan2(mouseY, mouseX);
    fill(255, 0, 0);
    circle(this.x, this.y, 50);
    //translate(cir.x, cir.y)
    //rotate(point)
    //rect(this.x, this.y, 60, 20);
    
    //image(spriteImages[0], this.x, this.y, 50, 50) // this is unfinished
  }
/*
  setup() {
    spriteImages.push(spritesheet)
  }

  keyPressed() {
    pressedKeys[key] = true
  }

  keyReleased() {
    delete pressedKeys[key];
  }
  */
}
