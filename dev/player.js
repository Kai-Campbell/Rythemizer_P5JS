let player;

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
    fill(255, 0, 0);
    circle(this.x, this.y, 30);
  }
}

let animation = [];
let animation2 = [];
let guy, spriteData, spritesheet, explodesheet, mapsheet, explodeData;
let bgX = 0;

const SPEED = 2;

function preload() {
  spriteData = loadJSON("red_guy.json");
  explodeData = loadJSON("explode.json");
  spritesheet = loadImage("assets/red_guy_sheet.png");
  explodesheet = loadImage("assets/element_explosion.png");
  mapsheet = loadImage("assets/lava_background.png");
}

function setup() {
  createCanvas(400, 400);
  textSize(32);
  
  const frames = spriteData.frames;
  const eframes = explodeData.frames;
  const frameCount = frames.length;
  const eframeCount = eframes.length;

  for (let i = 0; i < frameCount; i++) {
    const pos = frames[i].position;
    animation.push(spritesheet.get(pos.x, pos.y, pos.w, pos.h));
  }
  
  for (let i = 0; i < eframeCount; i++) {
    const pos = eframes[i].position;
    animation2.push(explodesheet.get(pos.x, pos.y, pos.w, pos.h));
  }

  guy = new Sprite(animation, 0, 75, 0.1);
  guy.size = 0.5;
  explode = new Sprite(animation2, 200, 200, 0.1);
  explode.size = 0.5;
}

function draw() {
  background(220);

  const moving = keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) ||
                 keyIsDown(UP_ARROW)   || keyIsDown(DOWN_ARROW);

  if (keyIsDown(LEFT_ARROW)) { 
    guy.x -= SPEED;
    guy.direction = -1;
    bgX += SPEED * 0.3;
  }
  if (keyIsDown(RIGHT_ARROW)) { 
    guy.x += SPEED;
    guy.direction = 1;
    bgX -= SPEED * 0.3;
  }
  if (keyIsDown(UP_ARROW))    guy.y -= SPEED;
  if (keyIsDown(DOWN_ARROW))  guy.y += SPEED;
  
  bgX = bgX % mapsheet.width;
  
  image(mapsheet, bgX, 0, width, height);
  image(mapsheet, bgX - mapsheet.width, 0, width, height);
  image(mapsheet, bgX + mapsheet.width, 0, width, height);

  // Switch frame range based on movement
  if (moving) {
    guy.setFrameRange(3, 6); // walking frames
    
  } else {
    guy.setFrameRange(0, 2); // idle frames
  }

  explode.setFrameRange(0, 0);
  
  if (guy.hits(explode)) {
    explode.setFrameRange(0, 3);
  }
  
  guy.show();
  guy.animate();
  
  explode.show();
  explode.animate();
  
  text("Arrow keys to move", 60, 75);
  text("He does the wave", 70, 120);
}