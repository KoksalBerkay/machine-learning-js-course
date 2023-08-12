const constants = require("../common/constants.js");

const KNN = require("../common/classifiers/knn.js");

const fs = require("fs");
const utils = require("../common/utils.js");

console.log("RUNNING CLASSIFICATION...");

const { samples: trainingSamples } = JSON.parse(
  fs.readFileSync(constants.TRAINING)
);

const kNN = new KNN(trainingSamples, 50);

const { samples: testingSamples } = JSON.parse(
  fs.readFileSync(constants.TESTING)
);

let totalCount = 0;
let correctCount = 0;

for (const sample of testingSamples) {
  const { label: predictedLabel } = kNN.predict(sample.point);
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
