if (typeof utils === "undefined") {
  utils = require("../utils.js");
}

class KNN {
  constructor(samples, k = 50) {
    this.samples = samples;
    this.k = k;
  }
  predict(point) {
    const samplePoints = this.samples.map((s) => s.point);
    const { indices, distances } = utils.getNearest(
      point,
      samplePoints,
      this.k
    );
    const nearestSamples = indices.map((i, index) => {
      let weight;
      const epsilon = 1e-6;
      if (distances[index] == 0) {
        weight = 1 / epsilon;
      } else {
        weight = 1 / distances[index];
      }
      return { ...this.samples[i], weight };
    });
    const labels = nearestSamples.map((s) => s.label);
    const weightedCounts = {};

    for (const sample of nearestSamples) {
      weightedCounts[sample.label] = weightedCounts[sample.label]
        ? weightedCounts[sample.label] + sample.weight
        : sample.weight;
    }

    const maxWeight = Math.max(...Object.values(weightedCounts));
    const predictedLabel = Object.keys(weightedCounts).find(
      (l) => weightedCounts[l] === maxWeight
    );

    return {
      label: predictedLabel,
      nearestSamples,
      weights: weightedCounts,
    };
  }
}

if (typeof module !== "undefined") {
  module.exports = KNN;
}
