const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const DRAW_LINES = false;

let amount = 10;
let speed = 1;
let size = 3;

let agents = [];

class Agent {
  constructor() {
    //let position = getStartingPosition();
    let position = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
    this.x = position.x;
    this.y = position.y;
    this.angle = Math.floor(Math.random() * 360) * (Math.PI / 180);
    this.following = false;
    this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    this.sensor = new Sensor(this.x, this.y, this.angle);
  }
}

class Sensor {
  constructor(x, y, angle) {
    //let position = getStartingPosition();
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.color = "rgba(255,255,255,0.3)";
  }
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  agents.forEach((agent) => {
    agent = moveAgent(agent);

    drawAgent(agent);
    ctx.fillStyle = agent.sensor.color;
    ctx.beginPath();
    ctx.arc(agent.sensor.x, agent.sensor.y, 40, agent.angle + degToRad(-45), agent.angle + degToRad(45));
    ctx.lineTo(agent.sensor.x, agent.sensor.y);
    ctx.closePath();
    ctx.fill();

    agents.forEach((otherAgent) => {
      if (agent != otherAgent) {
        const dx = agent.sensor.x - otherAgent.x;
        const dy = agent.sensor.y - otherAgent.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 40) {
          agent.sensor.color = "rgba(255,0,0,0.3)";
          ctx.beginPath();
          ctx.strokeStyle = "#ffffffff";
          ctx.lineWidth = 0.2;
          ctx.moveTo(agent.sensor.x, agent.sensor.y);
          ctx.lineTo(otherAgent.x, otherAgent.y);
          ctx.stroke();
          ctx.closePath();
        } else {
          agent.sensor.color = "rgba(255,255,255,0.3)";
        }
      }

      /* const dx = agent.x - otherAgent.x;
      const dy = agent.y - otherAgent.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
        if (DRAW_LINES) {
          ctx.beginPath();
          ctx.strokeStyle = agent.color;
          ctx.lineWidth = 0.2;
          ctx.moveTo(agent.x, agent.y);
          ctx.lineTo(otherAgent.x, otherAgent.y);
          ctx.stroke();
          ctx.closePath();
        }
        let sensorAngle = agent.angle + degToRad(60);
        if (otherAgent.angle > sensorAngle - degToRad(20) && otherAgent.angle < sensorAngle + degToRad(20)) {
          agent.following = true;
          //agent.angle = (agent.angle + otherAgent.angle) / 2;
          agent.angle = dirToAngle(otherAgent.x, otherAgent.y);

          ctx.beginPath();
          ctx.strokeStyle = agent.color;
          ctx.lineWidth = 0.2;
          ctx.moveTo(agent.x, agent.y);
          ctx.lineTo(otherAgent.x, otherAgent.y);
          ctx.stroke();
          ctx.closePath();
        } else {
          agent.following = false;
        }
      } */
    });
  });
  requestAnimationFrame(animate);
}
start();

function start() {
  for (let i = 0; i < amount; i++) {
    let agent = new Agent();
    drawAgent(agent);
    agents.push(agent);
  }
  animate();
}

function drawAgent(agent) {
  ctx.fillStyle = agent.color;
  ctx.beginPath();
  ctx.arc(agent.x, agent.y, size, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function moveAgent(agent) {
  direction = angleToDir(agent.angle);

  if (agent.x > canvas.width) direction.x *= -1;
  if (agent.x < 0) direction.x *= -1;
  if (agent.y > canvas.height) direction.y *= -1;
  if (agent.y < 0) direction.y *= -1;

  agent.angle = dirToAngle(direction.x, direction.y);

  agent.x += direction.x * speed;
  agent.y += direction.y * speed;

  agent.sensor.x = agent.x;
  agent.sensor.y = agent.y;
  agent.sensor.angle = agent.angle;

  return agent;
}

function reset() {}

function getStartingPosition() {
  switch (Math.floor(Math.random() * 4)) {
    case 0:
      return { x: 1, y: 1 };
    case 1:
      return { x: canvas.width - 1, y: 1 };
    case 2:
      return { x: 1, y: canvas.height - 1 };
    default:
      return { x: canvas.width - 1, y: canvas.height - 1 };
  }
}
