// 2D Noise
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/noise/0.5-2d-noise.html
// https://youtu.be/ikwNrFvnL3g
// https://editor.p5js.org/codingtrain/sketches/2_hBcOBrF

// This example has been updated to use es6 syntax. To learn more about es6 visit: https://thecodingtrain.com/Tutorials/16-javascript-es6

let inc = 0.01;
let frame = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
}

function draw() {
  let yoff = 0;
  loadPixels();
  for (let y = 0; y < height; y++) {
    let xoff = 0;
    for (let x = 0; x < width; x++) {
      let index = (x + y * width) * 4;
      // let r = random(255);
      let r = noise(xoff, yoff, frame) * 255;
      let col = 0;
      if (r > 128) col = 255;
      pixels[index + 0] = col;
      pixels[index + 1] = col;
      pixels[index + 2] = col;
      pixels[index + 3] = 255;

      xoff += inc;
    }
    yoff += inc;
  }
  frame += 0.1;
  background("rgba(0,0,0,0.05)");
  updatePixels();
}
