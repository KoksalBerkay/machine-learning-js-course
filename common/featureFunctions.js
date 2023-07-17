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
    const y = points.map(p => p[1]);

    const angle = featureFunctions.calculateRotationAngle(x, y); // Calculate rotation angle
    const projectedX = x.map((value, index) => {
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);
        return value * cosAngle + y[index] * sinAngle; // Apply rotation
    });

    const min = Math.min(...projectedX);
    const max = Math.max(...projectedX);
    return max - min;
};

featureFunctions.getHeight = (paths) => {
    const points = paths.flat();
    const x = points.map(p => p[0]);
    const y = points.map(p => p[1]);

    const angle = featureFunctions.calculateRotationAngle(x, y); // Calculate rotation angle
    const projectedY = y.map((value, index) => {
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);
        return value * cosAngle - x[index] * sinAngle; // Apply rotation
    });

    const min = Math.min(...projectedY);
    const max = Math.max(...projectedY);
    return max - min;
};

// Helper function to calculate the rotation angle based on the x and y coordinates
// The rotation angle is a radian value between 0 and 2 * PI
featureFunctions.calculateRotationAngle = (x, y) => {
    const covariance = x.reduce((sum, value, index) => sum + value * y[index], 0);
    const varianceX = x.reduce((sum, value) => sum + value ** 2, 0);
    const varianceY = y.reduce((sum, value) => sum + value ** 2, 0);
    const angle = 0.5 * Math.atan2(2 * covariance, varianceX - varianceY);
    // console.log("Angle of the drawing is " + angle + " radians");
    // const angleInDegrees = angle * 180 / Math.PI;
    // console.log("Angle of the drawing is " + angleInDegrees + " degrees");
    return angle;
}


featureFunctions.inUse = [
    // { name: "Path Count", function: featureFunctions.getPathCount },
    // { name: "Point Count", function: featureFunctions.getPointCount },
    { name: "Width", function: featureFunctions.getWidth },
    { name: "Height", function: featureFunctions.getHeight },
];

if (typeof module !== 'undefined') {
    module.exports = featureFunctions;
}