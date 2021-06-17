const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const DRAW_LINES = true;

let amount = 250;
let speed = 1;
let size = 3;

let agents = [];

let foods = [];

let frameCounter = 0;

let colors = ["rgb(0,255,0)", "rgb(255,0,0)", "rgb(0,0,255)"];

class Agent {
  constructor(x, y) {
    if (x == null) {
      let position = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
      this.x = position.x;
      this.y = position.y;
    } else {
      this.x = x;
      this.y = y;
    }
    this.kills = 0;
    this.size = size;
    this.angle = Math.floor(Math.random() * 360) * (Math.PI / 180);
    this.following = false;
    this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    //this.color = colors[Math.floor(Math.random() * colors.length)]

    this.sensor = new Sensor(this.x, this.y, this.angle);
  }
}

class Food {
  constructor(x, y) {
    if (x == null) {
      let position = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
      this.x = position.x;
      this.y = position.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }
}

class Sensor {
  constructor(x, y, angle) {
    //let position = getStartingPosition();
    this.x = x;
    this.y = y;
    this.size = 3;
    this.angle = angle;
    this.color = "rgba(255,255,255,0.3)";
  }
}

function animate() {
  console.log(agents.length);
  if (frameCounter % 60 == 0) foods.push(new Food());
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  foods.forEach((food) => {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x, food.y, size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  });

  agents.forEach((agent, agentIndex) => {
    agent = moveAgent(agent);

    drawAgent(agent);
    /*     ctx.fillStyle = agent.sensor.color;
    ctx.beginPath();
    ctx.arc(agent.sensor.x, agent.sensor.y, 40, agent.angle + degToRad(-45), agent.angle + degToRad(45));
    ctx.lineTo(agent.sensor.x, agent.sensor.y);
    ctx.closePath();
    ctx.fill(); */

    agents.forEach((otherAgent, index) => {
      if (agent != otherAgent) {
        const dx = agent.sensor.x - otherAgent.x;
        const dy = agent.sensor.y - otherAgent.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        /*         if (distance < 40) {
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
        } */
      }

      const dx = agent.x - otherAgent.x;
      const dy = agent.y - otherAgent.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        if (agent.size > otherAgent.size) {
          agent.angle = Math.atan2(otherAgent.y - agent.y, otherAgent.x - agent.x);
          if (DRAW_LINES) {
            ctx.beginPath();
            ctx.strokeStyle = agent.color;
            ctx.lineWidth = 0.2;
            ctx.moveTo(agent.x, agent.y);
            ctx.lineTo(otherAgent.x, otherAgent.y);
            ctx.stroke();
            ctx.closePath();
          }
        }
        if (agent.size < otherAgent.size) {
          agent.angle = Math.atan2(otherAgent.y - agent.y, otherAgent.x - agent.x) - degToRad(180);
        }
        if (distance < agent.size && agent.size > otherAgent.size) {
          agents.splice(index, 1);
          agent.kills = agent.kills + otherAgent.kills + 1;
          agent.size += otherAgent.size / 2;
        }
      }
    });
    if (agent.size > 60) {
      agents.splice(agentIndex, 1);
      for (let i = 0; i < agent.kills; i++) {
        agents.push(new Agent(agent.x, agent.y));
      }
    }
  });

  frameCounter++;
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
  ctx.arc(agent.x, agent.y, agent.size, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function moveAgent(agent) {
  foods.forEach((food, index) => {
    const dx = agent.x - food.x;
    const dy = agent.y - food.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 100) {
      agent.angle = Math.atan2(food.y - agent.y, food.x - agent.x);
      if (distance < agent.size) {
        foods.splice(index, 1);
        agent.size += 3;
      }
    }
  });

  direction = angleToDir(agent.angle);

  if (agent.x > canvas.width - agent.size) {
    direction.x = -Math.abs(direction.x);
    agent.x = canvas.width - agent.size;
  }
  if (agent.x < 0 + agent.size) {
    direction.x = Math.abs(direction.x);
    agent.x = 0 + agent.size;
  }
  if (agent.y > canvas.height - agent.size) {
    direction.y = -Math.abs(direction.y);
    agent.y = canvas.height - agent.size;
  }
  if (agent.y < 0 + agent.size) {
    direction.y = Math.abs(direction.y);
    agent.y = 0 + agent.size;
  }

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

function addCorner(event) {}

canvas.addEventListener("mousedown", function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  foods.push(new Food(x, y));
});
