function radToDeg(rad) {
  return rad * (180 / Math.PI);
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

function angleToDir(angle) {
  return { x: Math.cos(angle), y: Math.sin(angle) };
}

function dirToAngle(x, y) {
  return Math.atan2(y, x);
}
