const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const sizeInput = document.getElementById("Tsize");

let size = document.getElementById("Tsize").value;

sizeInput.addEventListener("change", (event) => {
  size = event.target.value;
});

let cursor = new Point(randomPos().x, randomPos().y);

let corners = [];

/* for (let i = 0; i < 3; i++) {
  corners.push(new Point(randomPos().x, randomPos().y));
}

corners.forEach((corner) => {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(corner.x, corner.y, size, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
});
 */
function animate() {
  size = document.getElementById("Tsize").value;

  let target = corners[Math.floor(Math.random() * corners.length)];
  cursor.x = (cursor.x + target.x) / 2;
  cursor.y = (cursor.y + target.y) / 2;
  ctx.fillStyle = "#70a7db";
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, size, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  requestAnimationFrame(animate);
}

function start() {
  animate();
}

function reset() {
  corners = [];

  // Store the current transformation matrix
  ctx.save();

  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Restore the transform
  ctx.restore();
}

function randomPos() {
  return { x: Math.floor(Math.random() * (650 + 1)), y: Math.floor(Math.random() * (500 + 1)) };
}

function addCorner(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  corners.push(new Point(x, y));
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

canvas.addEventListener("mousedown", function (e) {
  addCorner(e);
});
