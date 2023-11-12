const constants = require("../common/constants.js");

const MLP = require("../common/classifiers/mlp.js");

const fs = require("fs");
const utils = require("../common/utils.js");

console.log("RUNNING CLASSIFICATION...");

const { samples: trainingSamples } = JSON.parse(
  fs.readFileSync(constants.TRAINING)
);

const mlp = new MLP(
  [trainingSamples[0].point.length, 10, utils.classes.length],
  utils.classes
);

if (fs.existsSync(constants.MODEL)) {
  mlp.load(JSON.parse(fs.readFileSync(constants.MODEL)));
}

mlp.fit(trainingSamples, 5000);

fs.writeFileSync(constants.MODEL, JSON.stringify(mlp));

fs.writeFileSync(constants.MODEL_JS, `const model = ${JSON.stringify(mlp)};`);

const { samples: testingSamples } = JSON.parse(
  fs.readFileSync(constants.TESTING)
);

let totalCount = 0;
let correctCount = 0;

for (const sample of testingSamples) {
  const { label: predictedLabel } = mlp.predict(sample.point);
  correctCount += predictedLabel == sample.label;
  totalCount++;
}

console.log(
  "ACCURACY: " +
    correctCount +
    "/" +
    totalCount +
    " (" +
    utils.formatPercent(correctCount / totalCount) +
    ")"
);

console.log("GENERATING DECISION BOUNDARY ...");

const { createCanvas } = require("canvas");
const imgSize = 1000;
const canvas = createCanvas(imgSize, imgSize);
const ctx = canvas.getContext("2d");

// THESE VALUES ARE HARDCODED FOR THE DATASET
// TODO: MAKE THEM DYNAMIC

const rangeMinX = -2.9;
const rangeMinY = -2.34;

const rangeMaxX = 3.54;
const rangeMaxY = 2.94;

const meanOfMax = (rangeMaxX + rangeMaxY) / 2;
const meanOfMin = (rangeMinX + rangeMinY) / 2;

const step = (meanOfMax - meanOfMin) / imgSize;

for (let x = 0; x < canvas.width; x++) {
  for (let y = 0; y < canvas.height; y++) {
    const point = [rangeMinX + x * step, rangeMinY + (imgSize - y - 1) * step];

    while (point.length < trainingSamples[0].point.length) {
      point.push(0);
    }

    const { label } = mlp.predict(point);
    const color = utils.styles[label].color;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }
  utils.printProgress(x + 1, canvas.width);
}

const buffer = canvas.toBuffer("image/png");
fs.writeFileSync(constants.DECISION_BOUNDARY, buffer);
