const utils = {};

utils.flaggedUsers = [1663882102141, 1663900040545, 1664485938220];

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
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
};

utils.getNearest = (loc, points) => {
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearestIndex = 0;

    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const d = utils.distance(loc, point);

        if (d < minDist) {
            minDist = d;
            nearestIndex = i;
        }
    }
    return nearestIndex;
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
    }
    else {
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
        stdDev = stdDev.map((s) => Math.sqrt(s / (points.length - 1))); // Correct the denominator
    }

    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < dimensions; j++) {
            points[i][j] = (points[i][j] - mean[j]) / stdDev[j];
        }
    }

    console.log("STANDARD DEVIATION: " + stdDev + "\n" + "MEAN: " + mean);
    return { mean, stdDev };
}


if (typeof module !== "undefined") {
    module.exports = utils;
}
