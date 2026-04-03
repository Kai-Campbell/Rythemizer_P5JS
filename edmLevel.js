let levelMusic;
let projectiles = []; // holds the projectiles being shot
let player_x = 300;
let player_y = 300; // this can be changed when the player class is ready
let player_1;

function setup() {
  createCanvas(960, 540);
  x = 0;
  playLevelMusic();
  player_1 = new Player(player_x, player_y)
}

function preload() {
  back = loadImage('Assets/test_level_edm.png');
  levelMusic = loadSound('Assets/Music/Terrible_Placeholder_Music.mp3');
}

function draw() {
  image(back, 0, 0, 960, 540);
  player_1.update()
  player_1.draw()
  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].update();
    projectiles[i].display();

    if (projectiles[i].isOffScreen()) {
      projectiles.splice(i, 0)
    }
  }
}

function playLevelMusic() {
  levelMusic.play();
  levelMusic.setVolume(0.3); // change the volume between 0.0 and 1.0 if needed
  userStartAudio();
}

function mousePressed() {
  projectiles.push(new Projectile(player_1.x, player_1.y, mouseX, mouseY, "player"));
}

function keyPressed() {
  pressedKeys[key] = true;
}

function keyReleased() {
  pressedKeys[key] = false;
}

