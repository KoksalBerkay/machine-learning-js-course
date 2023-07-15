const featureFunctions = {};

featureFunctions.getPathCount = (paths) => {
    return paths.length;
}

featureFunctions.getPointCount = (paths) => {
    const points = paths.flat();
    return points.length;
}

featureFunctions.getWidth = (paths) => {
    const points = paths.flat();
    const x = points.map(p => p[0]);
    const min = Math.min(...x);
    const max = Math.max(...x);
    return max - min;
}

featureFunctions.getHeight = (paths) => {
    const points = paths.flat();
    const y = points.map(p => p[1]);
    const min = Math.min(...y);
    const max = Math.max(...y);
    return max - min;
}

if (typeof module !== 'undefined') {
    module.exports = featureFunctions;
}