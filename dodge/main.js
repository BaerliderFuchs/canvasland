const SPEED = 10;
let WARP_MODE = false;
let MOUSE_MODE = false;

let player;
let frameCount = 0;
let score = 0;
let highscore = 0;
let skillshots = []
let pills = []


let spritesheet;
let playerSpritedata;
let playerAnimation = [];


function preload() {
  playerSpritedata = loadJSON('animations/player.json');
  spritesheet = loadImage('DungeonTileset.png');
}

class Player {
  constructor() {
    this.x = windowWidth/2;
    this.y = windowHeight/2;
    this.r = 50;
    this.speed = SPEED;
    this.sprite = new Sprite(playerAnimation, 0, 0, 0.1);
  }

  update() {
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.r += 0.1
    this.checkCollision();
    if (MOUSE_MODE) {
      this.x = mouseX;
      this.y = mouseY;
    } else {
      if (keyIsDown(65)) {
        this.x -= this.speed;
      }
    
      if (keyIsDown(68)) {
        this.x += this.speed;
      }
    
      if (keyIsDown(87)) {
        this.y -= this.speed;
      }
    
      if (keyIsDown(83)) {
        this.y += this.speed;
      }  
    }
    if (keyIsDown(32)) {
      console.log(MOUSE_MODE);
      MOUSE_MODE = !MOUSE_MODE
    }

    if (WARP_MODE) {
      if (this.y < 0 - this.r) this.y = windowHeight + this.r;
      if (this.y > windowHeight + this.r) this.y =  0 - this.r;
      if (this.x < 0 - this.r) this.x = windowWidth + this.r;
      if (this.x > windowWidth + this.r) this.x =  0 - this.r;
    } else {
      if (this.y < 0 + this.r/2) this.y = 0 + this.r/2;
      if (this.y > windowHeight - this.r/2) this.y = windowHeight - this.r/2;
      if (this.x < 0 + this.r/2) this.x = 0 + this.r/2;
      if (this.x > windowWidth - this.r/2) this.x = windowWidth - this.r/2;
    }

  }

  draw() {
    noStroke();
    fill("#2b2d42");
    circle(this.x, this.y, this.r);
    //this.sprite.show();
    //this.sprite.animate()
  }

  checkCollision() {
    skillshots.forEach(skillshot => {
      let distance = dist(this.x, this.y, skillshot.x, skillshot.y);
      if (distance < this.r/2) {
        setup();
      }
    });
    pills.forEach((pill, index) => {
      let distance = dist(this.x, this.y, pill.x, pill.y);
      if (distance < this.r/2) {
        pills.splice(index, 1)
        this.r /= 2;
      }
    });
  }
}

class Skillshot {
  constructor() {
    this.x = Math.random() < 0.5 ? windowWidth : 0;
    this.y = Math.random() < 0.5 ? windowHeight : 0;
    this.angle = Math.atan2(player.y - this.y, player.x - this.x);
    this.speed = 5;
    this.r = 50;
  }

  draw() {
    noStroke();
    fill("#bf1a2f");
    circle(this.x, this.y, this.r);
  }

  update() {
    let direction = angleToDir(this.angle);

    if (this.x < 0 || this.x > width) direction.x *= -1;
    if (this.y < 0 || this.y > height) direction.y *= -1;

    this.x += direction.x * this.speed;
    this.y += direction.y * this.speed;
    this.angle = dirToAngle(direction.x, direction.y);
  }
}

class Pill {
  constructor() {
    this.r = 0;
    this.x = Math.random() * windowWidth;
    this.y = Math.random() * windowHeight;

    pills.push(this)
  }

  draw() {
    noStroke();
    fill("#7bc950");
    circle(this.x, this.y, this.r);
  }
}

function setup() {
  let frames = playerSpritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    playerAnimation.push(img);
  }

  if (score > highscore) highscore = score;
  score = 0;
  createCanvas(windowWidth, windowHeight);
  skillshots = [];
  pills = [];
  player = new Player();
  player.draw();
}

function draw() {
  background("#f8f7f9");
  player.update();
  player.draw();

  skillshots.forEach(skillshot => {
    skillshot.update();
    skillshot.draw();
  });

  pills.forEach(pill => {
    pill.draw();
    if (pill.r < 50) pill.r ++
  });

  textSize(32);
  fill(0, 102, 153);
  text('Score: ' + score, 10, 30);
  text('Highscore: ' + highscore, 10, 60);

  if (frameCount % 150 == 0) skillshots.push(new Skillshot());
  if (frameCount % 600 == 0) new Pill()
  if (frameCount % 10 == 0) score++;
  frameCount++;
}
