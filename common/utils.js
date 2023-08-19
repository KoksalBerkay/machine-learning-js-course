const utils = {};

utils.flaggedUsers = [
  1663882102141, 1663900040545, 1664485938220, 1664485938220, 1682255271235,
];

utils.styles = {
  car: { color: "gray", text: "🚗" },
  fish: { color: "red", text: "🐟" },
  house: { color: "yellow", text: "🏠" },
  tree: { color: "green", text: "🌳" },
  bicycle: { color: "cyan", text: "🚲" },
  guitar: { color: "blue", text: "🎸" },
  pencil: { color: "magenta", text: "✏️" },
  clock: { color: "lightgray", text: "🕜" },
};
utils.styles["?"] = { color: "red", text: "❓" };

utils.formatPercent = (n) => {
  return (n * 100).toFixed(2) + "%";
};

utils.printProgress = (count, max) => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  const percent = utils.formatPercent(count / max);
  process.stdout.write(count + "/" + max + " (" + percent + ")");
};

utils.groupBy = (objArray, key) => {
  const groups = {};
  for (let obj of objArray) {
    const value = obj[key];
    if (groups[value] == null) {
      groups[value] = [];
    }
    groups[value].push(obj);
  }
  return groups;
};

utils.distance = (p1, p2) => {
  let sqDist = 0;
  for (let i = 0; i < p1.length; i++) {
    sqDist += (p1[i] - p2[i]) ** 2;
  }
  return Math.sqrt(sqDist);
};

utils.getNearest = (loc, points, k = 1) => {
  const obj = points.map((val, ind) => {
    return { ind, val };
  });

  const sorted = obj.sort((a, b) => {
    return utils.distance(loc, a.val) - utils.distance(loc, b.val);
  });

  const indices = sorted.map((obj) => obj.ind);
  // get the distances of each and store them in an array
  const distances = sorted.map((obj) => utils.distance(loc, obj.val));
  return { indices: indices.slice(0, k), distances: distances.slice(0, k) };
};

utils.invLerp = (a, b, v) => {
  return (v - a) / (b - a);
};

// utils.normalizePoints = (points, minMax) => {
//     let min, max;
//     const dimensions = points[0].length;
//     if (minMax) {
//         min = minMax.min;
//         max = minMax.max;
//     } else {
//         min = [...points[0]];
//         max = [...points[0]];

//         for (let i = 1; i < points.length; i++) {
//             for (let j = 0; j < dimensions; j++) {
//                 min[j] = Math.min(min[j], points[i][j]);
//                 max[j] = Math.max(max[j], points[i][j]);
//             }
//         }
//     }
//     for (let i = 0; i < points.length; i++) {
//         for (let j = 0; j < dimensions; j++) {
//             points[i][j] = utils.invLerp(min[j], max[j], points[i][j]);
//         }
//     }
//     return { min, max };
// };

utils.standardizePoints = (points, vars) => {
  const dimensions = points[0].length;
  let mean = Array(dimensions).fill(0);
  let stdDev = Array(dimensions).fill(1); // Initialize with ones for correct division

  if (vars) {
    mean = vars.mean;
    stdDev = vars.stdDev;
  } else {
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < dimensions; j++) {
        mean[j] += points[i][j];
      }
    }
    mean = mean.map((m) => m / points.length);

    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < dimensions; j++) {
        stdDev[j] += (points[i][j] - mean[j]) ** 2;
      }
    }
    stdDev = stdDev.map((s) => Math.sqrt(s / points.length));
  }

  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < dimensions; j++) {
      points[i][j] = (points[i][j] - mean[j]) / stdDev[j];
    }
  }

  return { mean, stdDev };
};

utils.toCSV = (headers, samples) => {
  let str = headers.join(",") + "\n";
  for (const sample of samples) {
    str += sample.join(",") + "\n";
  }
  return str;
};

if (typeof module !== "undefined") {
  module.exports = utils;
}
