let levelMusic;

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
}

function playLevelMusic() {
  levelMusic.play();
  levelMusic.setVolume(0.3); // change the volume between 0.0 and 1.0 if needed
}


