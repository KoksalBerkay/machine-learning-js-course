const draw = require('../common/draw.js');
const constants = require('../common/constants.js');
const utils = require('../common/utils.js');

const { createCanvas } = require('canvas');
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext('2d');

const fs = require('fs');

const fileNames = fs.readdirSync(constants.RAW_DIR);
const samples = [];
let id = 1;

fileNames.forEach(fn => {
    const content = fs.readFileSync(
        constants.RAW_DIR + "/" + fn
    );
    const { session, student, drawings } = JSON.parse(content);
    for (let label in drawings) {
        samples.push({
            id,
            label,
            student_name: student,
            student_id: session,
        });

        const paths = drawings[label];
        fs.writeFileSync(
            constants.JSON_DIR + "/" + id + ".json",
            JSON.stringify(paths)
        );

        generateImageFile(constants.IMG_DIR + "/" + id + ".png", paths);

        utils.printProgress(id, fileNames.length * 8); // each file contains 8 drawings
        id++;
    }
});

fs.writeFileSync(constants.SAMPLES, JSON.stringify(samples));

fs.writeFileSync(constants.SAMPLES_JS, "const samples = " + JSON.stringify(samples) + ";");


function generateImageFile(outFile, paths) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw.paths(ctx, paths);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outFile, buffer);
}