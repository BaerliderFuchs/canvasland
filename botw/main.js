// 2D Noise
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/noise/0.5-2d-noise.html
// https://youtu.be/ikwNrFvnL3g
// https://editor.p5js.org/codingtrain/sketches/2_hBcOBrF

// This example has been updated to use es6 syntax. To learn more about es6 visit: https://thecodingtrain.com/Tutorials/16-javascript-es6

const USE_GRADIENT = false;
const DRAW_BORDERS = true;
const GENERATE_LANDMARKS = false;
const CHUNK_SIZE = 100;
const SEA_LEVEL = 100;
const HEIGHT_LAYERS = 24;
const COLORS = {
  DEEP_WATER: [32, 43, 45],
  SHALLOW_WATER: [64, 81, 88],
  LOW_GROUND: [61, 48, 3],
  HIGH_GROUND: [192, 196, 172],
  BORDER: [49, 35, 0]
}

let inc = 0.003;

let layerColors = [
  // Water
  ["rgb(32, 43, 45)"],
  ["rgb(64, 81, 88)"],
  // Ground
  ["rgb(61, 48, 3)"],
  ["rgb(65, 50, 5)"],
  ["rgb(69, 54, 11)"],
  ["rgb(70, 57, 13)"],
  ["rgb(77, 64, 20)"],
  ["rgb(85, 73, 33)"],
  ["rgb(92, 83, 42)"],
  ["rgb(97, 85, 45)"],
  ["rgb(100, 90, 52)"],
  ["rgb(104, 95, 56)"],
  ["rgb(109, 101, 64)"],
  ["rgb(117, 109, 72)"],
  ["rgb(125, 119, 85)"],
  ["rgb(132, 128, 91)"],
  ["rgb(144, 138, 104)"],
  ["rgb(148, 143, 113)"],
  ["rgb(151, 150, 120)"],
  ["rgb(155, 154, 124)"],
  ["rgb(165, 166, 135)"],
  ["rgb(172, 172, 146)"],
  ["rgb(177, 177, 151)"],
  ["rgb(185, 185, 159)"],
  ["rgb(188, 188, 164)"],
  ["rgb(196, 200, 176)"],
  ["rgb(192, 196, 172)"]
]

let chunks = []

let layers = []

let xOffset = 0;
let yOffset = 0;

let time = 0;

function preload() {
  villageMarker = loadImage('markers/village.png');
  shrineMarker = loadImage('markers/shrine.png');
}

function setup() {
  setAttributes('antialias', true);
  createCanvas(windowWidth, windowHeight);
  //canvas.parent('sketch-holder');
  pixelDensity(1);
  textFont("Arial");
  textSize(20);
  textAlign(CENTER, CENTER);
  //noiseSeed(1)
  layerColors.forEach(color => {
    let rgb = color.toString().split(")"); //gives "rgba(111,222,333,0.5" at index 0
    rgb = rgb[0].split("(");   //gives "111,222,333,0.5 at index 1
    rgb = rgb[1].split(","); 
    rgbArray = [];
    rgb.forEach(colorValue => {
      rgbArray.push(parseInt(colorValue))
    });
    layers.push(rgbArray)
  });
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

  let yoff = 0;
  loadPixels();
  for (let y = 0; y < height; y++) {
    let xoff = 0;
    for (let x = 0; x < width; x++) {
      let index = (x + y * width) * 4;
      //noiseDetail(2, 2);
      let r = noise(xoff, yoff, time) * 255;


      let color = COLORS.DEEP_WATER;

      if (USE_GRADIENT) {
        if (r < SEA_LEVEL) {
          color = [
            layers[0][0] + ((r-100)/120) * (layers[1][0] - layers[0][0]),
            layers[0][1] + ((r-100)/120) * (layers[1][1] - layers[0][1]),
            layers[0][2] + ((r-100)/120) * (layers[1][2] - layers[0][2])
          ]
        }

        if (r > SEA_LEVEL) {
          color = [
            layers[2][0] + ((r-120)/135) * (layers[layers.length-1][0] - layers[2][0]),
            layers[2][1] + ((r-120)/135) * (layers[layers.length-1][1] - layers[2][1]),
            layers[2][2] + ((r-120)/135) * (layers[layers.length-1][2] - layers[2][2])
          ]
        }

      } else {
        if (r > SEA_LEVEL - 10) color = COLORS.SHALLOW_WATER;

        let heigtLayersDecimal = 1 / HEIGHT_LAYERS;

        if (r > SEA_LEVEL) {
          for (let i = 0; i < HEIGHT_LAYERS; i++) {
            color = [
              Math.round(COLORS.LOW_GROUND[0] + (Math.ceil(((r - SEA_LEVEL) / (255 - SEA_LEVEL))/heigtLayersDecimal)*heigtLayersDecimal) * (COLORS.HIGH_GROUND[0] - COLORS.LOW_GROUND[0])),
              Math.round(COLORS.LOW_GROUND[1] + (Math.ceil(((r - SEA_LEVEL) / (255 - SEA_LEVEL))/heigtLayersDecimal)*heigtLayersDecimal) * (COLORS.HIGH_GROUND[1] - COLORS.LOW_GROUND[1])),
              Math.round(COLORS.LOW_GROUND[2] + (Math.ceil(((r - SEA_LEVEL) / (255 - SEA_LEVEL))/heigtLayersDecimal)*heigtLayersDecimal) * (COLORS.HIGH_GROUND[2] - COLORS.LOW_GROUND[2])),
            ];
          }
        }

/*         for (let i = 0; i < layers.length-1; i++) {
          if (r > SEA_LEVEL + i*((255 - SEA_LEVEL)/(layers.length-2))) color = layers[i+1];
        } */
      }

      if (r > SEA_LEVEL + 1 && DRAW_BORDERS) {
        //if ((pixels[index-4] != color[0] && pixels[index - 4] != 49) || pixels[(x + (y-1) * width) * 4] != color[0] && pixels[(x + (y-1) * width) * 4] != 49) color = COLORS.BORDER;
        let pixel = [
          color[0],
          color[1],
          color[2]
        ];
        let leftNeighbour = [
          pixels[index - 4],
          pixels[index - 3],
          pixels[index - 2]
        ];
        let topNeighbour = [
          pixels[(index) - (windowWidth * 4)],
          pixels[(index + 1) - (windowWidth * 4)],
          pixels[(index + 2) - (windowWidth * 4)],
        ];
/*         let rightNeighbour = [
          pixels[index + 4],
          pixels[index + 5],
          pixels[index + 6]
        ];
        let bottomNeighbour = [
          pixels[(index) + (windowWidth * 4)],
          pixels[(index + 1) + (windowWidth * 4)],
          pixels[(index + 2) + (windowWidth * 4)],
        ]; */
        if (JSON.stringify(pixel) !== JSON.stringify(leftNeighbour) && JSON.stringify(leftNeighbour) !== JSON.stringify(COLORS.BORDER) || JSON.stringify(pixel) !== JSON.stringify(topNeighbour) && JSON.stringify(topNeighbour) !== JSON.stringify(COLORS.BORDER)) color = COLORS.BORDER;
 /*        if (JSON.stringify(pixel) !== JSON.stringify(COLORS.BORDER) && JSON.stringify(leftNeighbour) !== JSON.stringify(COLORS.BORDER) && JSON.stringify(topNeighbour) !== JSON.stringify(COLORS.BORDER) ) {
          if (JSON.stringify(pixel) !== JSON.stringify(rightNeighbour) && JSON.stringify(rightNeighbour) !== JSON.stringify(COLORS.BORDER) || JSON.stringify(pixel) !== JSON.stringify(bottomNeighbour) && JSON.stringify(bottomNeighbour) !== JSON.stringify(COLORS.BORDER)) color = COLORS.BORDER;
        } */
      }

      pixels[index + 0] = color[0];
      pixels[index + 1] = color[1];
      pixels[index + 2] = color[2];
      pixels[index + 3] = 255;

      xoff += inc;
    }
    yoff += inc;
  }
  updatePixels();

  if (GENERATE_LANDMARKS) generateLandmarks();

  noLoop();
}

function generateLandmarks() {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let index = (x + y * width) * 4;
      if (Math.random() < 0.999995 || pixels[index] == 32 || pixels[index] == 64) continue;
      fill("rgb(229, 217, 137)");
      stroke("rgb(116, 97, 48)");
      strokeWeight(4);
      switch (Math.floor(Math.random()*3)) {
        case 0:
          image(villageMarker, x - 15, y - 15)
          break;
        case 1:
          text('Great Plateau', x, y)
          break;
          case 2:
            image(shrineMarker, x - 15, y - 15)
            break;
        default:
          break;
      }

    }
  }

}

function mouseWheel(event) {
  print(event.delta);
  //move the square according to the vertical scroll amount
  time += 0.0005 * event.delta;
  //uncomment to block page scrolling
  //return false;
}