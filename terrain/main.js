// 2D Noise
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/noise/0.5-2d-noise.html
// https://youtu.be/ikwNrFvnL3g
// https://editor.p5js.org/codingtrain/sketches/2_hBcOBrF

// This example has been updated to use es6 syntax. To learn more about es6 visit: https://thecodingtrain.com/Tutorials/16-javascript-es6

let inc = 0.05;
let resolution = 20;

let xOffset = 0;
let yOffset = 0;

let pixels = [];

let frame = 1;

let types = [
  { name: "deep water", height: 0, color: [217, 67, 54] },
  { name: "water", height: 80, color: [217, 90, 61] },
  { name: "sand", height: 100 },
  { name: "grass", height: 120 },
  { name: "hill", height: 160 },
  { name: "mountain", height: 170 },
  { name: "snow", height: 185 },
];

class Pixel {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.hasTree = false;
    this.texture = Math.random() * 20 - 10;
    this.color;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  colorMode(HSL);
  noiseSeed(99);

  let yoff = 0 + yOffset;
  pixels = [];
  for (let y = 0; y < height / resolution; y++) {
    let row = [];
    let xoff = 0 + xOffset;
    for (let x = 0; x < width / resolution; x++) {
      let r = noise(xoff, yoff, frame) * 255;
      // Deep Water
      let type = "deep water";
      // Water
      if (r > 80) type = "water";
      // Sand
      if (r > 100) type = "sand";
      // Grass
      if (r > 120) type = "grass";
      // Hill
      if (r > 160) type = "hill";
      // Mountain
      if (r > 170) type = "mountain";
      // Snow
      if (r > 185) type = "snow";
      row.push(new Pixel(x * resolution, y * resolution, type));
      xoff += inc;
    }
    pixels.push(row);
    yoff += inc;
  }
  polish();
  polish();
  polish();
  polish();
  polishTexture();
  //polishEdges();
}

function polish() {
  pixels.forEach((row, y) => {
    row.forEach((pixel, x) => {
      neighbours = getNeighbours(y, x);
      types.forEach((type) => {
        let count = 0;
        neighbours.forEach((neighbour) => {
          if (neighbour == null) return;
          if (type.name == neighbour.type) count++;
        });
        if (count >= 5) pixel.type = type.name;
      });
    });
  });
}

function polishTexture() {
  pixels.forEach((row, y) => {
    row.forEach((pixel, x) => {
      neighbours = getNeighbours(y, x);
      types.forEach((type) => {
        let textureSum = pixel.texture;
        let sameTypeCount = 1;
        neighbours.forEach((neighbour) => {
          if (neighbour == null) return;
          if (neighbour.type == pixel.type) {
            sameTypeCount++;
            textureSum += neighbour.texture;
            pixel.texture = textureSum / sameTypeCount;
          }
        });
      });
    });
  });
}

function polishEdges() {
  pixels.forEach((row, y) => {
    row.forEach((pixel, x) => {
      neighbours = getNeighbours(y, x);
      types.forEach((type) => {
        let textureSum = pixel.texture;
        let sameTypeCount = 1;
        neighbours.forEach((neighbour) => {
          if (neighbour == null) return;
          if (neighbour.type == pixel.type) {
            sameTypeCount++;
            textureSum += neighbour.texture;
            pixel.texture = textureSum / sameTypeCount;
          }
        });
      });
    });
  });
}

function getNeighbours(y, x) {
  return [getPixel(y - 1, x), getPixel(y - 1, x + 1), getPixel(y, x + 1), getPixel(y + 1, x + 1), getPixel(y + 1, x), getPixel(y + 1, x - 1), getPixel(y, x - 1), getPixel(y - 1, x - 1)];
}

function getPixel(y, x) {
  var NO_VALUE = null;
  var value, hasValue;

  try {
    hasValue = pixels[y][x] !== undefined;
    value = hasValue ? pixels[y][x] : NO_VALUE;
  } catch (e) {
    value = NO_VALUE;
  }

  return value;
}

function draw() {
  if (keyIsDown(LEFT_ARROW)) {
    xOffset -= 0.1;
    setup();
  }

  if (keyIsDown(RIGHT_ARROW)) {
    xOffset += 0.1;
    setup();
  }

  if (keyIsDown(UP_ARROW)) {
    yOffset -= 0.1;
    setup();
  }

  if (keyIsDown(DOWN_ARROW)) {
    yOffset += 0.1;
    setup();
  }

  if (keyIsDown(80)) {
    polish();
  }

  if (keyIsDown(84)) {
    //polishTexture();
    frame += 0.01;
    setup();
  }
  if (keyIsDown(82)) {
    //polishTexture();
    frame -= 0.01;
    setup();
  }

  let yoff = 0 + yOffset;

  pixels.forEach((row) => {
    row.forEach((pixel) => {
      let color = [217, 67, 54 + pixel.texture];
      switch (pixel.type) {
        case "deep water":
          color = [217, 65, 48 + pixel.texture];
          break;
        case "water":
          color = [217, 90, 61 + pixel.texture];
          break;
        case "sand":
          color = [40, 65, 65 + pixel.texture];
          break;
        case "grass":
          color = [107, 35, 38 + pixel.texture];
          break;
        case "hill":
          color = [195, 2, 51 + pixel.texture];
          break;
        case "mountain":
          color = [204, 2, 44 + pixel.texture];
          break;
        case "snow":
          color = [0, 0, 93 + pixel.texture];
          break;
      }
      if (pixel.type == "grass" && Math.random() > 0.95) pixel.hasTree = true;
      fill(color[0], color[1], color[2]);
      //if (pixel.hasTree) fill(31, 29, 31);
      noStroke();
      square(pixel.x, pixel.y, resolution);
    });
  });
  // for (let y = 0; y < height / resolution; y++) {
  //   let xoff = 0;
  //   for (let x = 0; x < width / resolution; x++) {
  //     let index = (x + (y * width) / resolution) * 4;
  //     // let r = random(255);
  //     let r = noise(xoff, yoff) * 255;

  //     let texture = Math.random() * 10 - 5;
  //     // Deep Water
  //     let color = [217, 65, 48 + texture];
  //     // Water
  //     if (r > 80) color = [217, 90, 61 + texture];
  //     // Sand
  //     if (r > 100) color = [40, 65, 65 + texture];
  //     // Dirt
  //     if (r > 110) color = [86, 38, 33 + texture];
  //     // Grass
  //     if (r > 120) color = [107, 35, 38 + texture];
  //     // Mountain
  //     if (r > 160) color = [195, 2, 51 + texture];
  //     // Snow
  //     if (r > 185) color = [0, 0, 93 + texture];

  //     fill(color[0], color[1], color[2]);
  //     noStroke();
  //     square(x * resolution, y * resolution, resolution);

  //     /*let cloudNoise = noise(xoff, yoff) * 255;
  //     let cloudColor = 0;
  //     if (cloudNoise > 160)  cloudColor = [0, 0, 86 + texture]
  //     if (cloudNoise > 180)  cloudColor = [0, 0, 95 + texture]
  //     if (cloudColor != 0) {
  //       fill(cloudColor[0], cloudColor[1], cloudColor[2]);
  //       square(x*10,y*10,10);
  //     }*/
  //     //pixels[index + 0] = r;
  //     //pixels[index + 1] = r;
  //     //pixels[index + 2] = r;
  //     //pixels[index + 3] = 255;

  //     xoff += inc;
  //   }
  //   yoff += inc;
  // }
  //updatePixels();
  //noLoop();
}
