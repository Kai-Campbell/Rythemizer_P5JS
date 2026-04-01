let levelMusic;
let projectiles = []; // holds the projectiles being shot
let player_x = 300;
let player_y = 300; // this can be changed when the player class is ready

function setup() {
  createCanvas(960, 540);
  x = 0;
  playLevelMusic();
}

function preload() {
  back = loadImage('Assets/Test_Level_Lava.png');
  levelMusic = loadSound('Assets/Music/Terrible_Placeholder_Music.mp3');
}

function draw() {
  image(back, 0, 0, 960, 540);
  circle(player_x, player_y, 50); // temporary character 
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
  projectiles.push(new Projectile(player_x, player_y, mouseX, mouseY));
}

