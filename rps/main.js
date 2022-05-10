const AMOUNT = 200;
const SPEED = 4
const SIZE = 32

let images = {}

let agents = []

class Agent {
  constructor(x, y) {
    if (x == null) {
      this.x = random(0, width);
      this.y = random(0, height);
    } else {
      this.x = x;
      this.y = y;
    }
    this.angle = Math.floor(Math.random() * 360) * (Math.PI / 180);
    this.speed = SPEED

    switch (Math.floor(Math.random() * 3)+1) {
      case 1:
        this.type = "⛰️"
        break;
      case 2: 
        this.type = "📜"
        break;
      case 3: 
        this.type = "✂️"
        break;
    }
  }

  draw() {
    translate(width / 2, height / 2);
   rotate(PI / 180 * 45);
   imageMode(CENTER);
    image(images[this.type], this.x - SIZE/2, this.y - SIZE/2, SIZE, SIZE);
  }

  move() {
    let direction = angleToDir(this.angle);

    if (this.x < 0 || this.x > width) direction.x *= -1;
    if (this.y < 0 || this.y > height) direction.y *= -1;

    if (this.x < 0) this.x = 0;
    if (this.x > width) this.x = width;
    if (this.y < 0) this.y = 0;
    if (this.y > height) this.y = height;

    this.x += direction.x * this.speed;
    this.y += direction.y * this.speed;
    this.angle = dirToAngle(direction.x, direction.y);

    if (Math.random() < 0.01) this.angle = Math.floor(Math.random() * 360) * (Math.PI / 180);
  }

  hunt() {
    agents.forEach((agent, i) => {
      if (agent == this) return;
      let dis = dist(this.x, this.y, agent.x, agent.y);
      if (dis <= 100) {
        if ((this.type == "⛰️" && agent.type == "✂️") || (this.type == "📜" && agent.type == "⛰️") || (this.type == "✂️" && agent.type == "📜")) {
          this.angle = Math.atan2(agent.y - this.y, agent.x - this.x);
          stroke("rgba(0,255,255,0.4)");
          line(this.x, this.y, agent.x, agent.y);

          if (dis <= SIZE) {
            agent.type = this.type
          }
        }
        if ((this.type == "✂️" && agent.type == "⛰️") || (this.type == "⛰️" && agent.type == "📜") || (this.type == "📜" && agent.type == "✂️")) {
          this.angle = Math.atan2(agent.y - this.y, agent.x - this.x) - degToRad(180);
        }
      }
    });
  }
}

function preload() {
  images["⛰️"] = loadImage('assets/rock.png');
  images["📜"] = loadImage('assets/paper.png');
  images["✂️"] = loadImage('assets/scissors.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < AMOUNT; i++) {
    agents.push(new Agent())    
  }
}

function draw() {
  background("rgba(255,255,255,1)");
  agents.forEach(agent => {
    agent.draw()
    agent.hunt()
    agent.move()
  });

  drawStats()
}

function drawStats() {
  let stats = {
    "⛰️": 0,
    "📜": 0,
    "✂️": 0
  }

  agents.forEach(agent => {
    stats[agent.type]++
  });

  noStroke();
  fill("rgba(0,0,0,0.5)");
  rect(20, 0, 140, 132, 0, 0, 20, 0);

  textSize(32);
  fill(255, 255, 255);
  text('⛰️: ' + stats["⛰️"], 32, 32);
  text('📜: ' + stats["📜"], 32, 72);
  text('✂️: ' + stats["✂️"], 32, 112);

  fill("rgb(93, 93, 89)")
  rect(0, 0, 20, height / AMOUNT * stats["⛰️"]);
  fill("rgb(201, 162, 126)");
  rect(0, height / AMOUNT * stats["⛰️"], 20, height / AMOUNT * stats["📜"]);
  fill("rgb(240, 58, 23)");
  rect(0, (height / AMOUNT * stats["⛰️"]) + (height / AMOUNT * stats["📜"]), 20, height / AMOUNT * stats["✂️"]);
}

/* full screening will change the size of the canvas */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
