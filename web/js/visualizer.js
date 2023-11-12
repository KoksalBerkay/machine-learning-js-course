class Visualizer {
  static drawNetwork(ctx, network, outputLabels = []) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    const levelHeight = height / network.levels.length;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let i = network.levels.length - 1; i >= 0; i--) {
      const levelTop =
        top +
        lerp(
          height - levelHeight,
          0,
          network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1)
        );

      Visualizer.drawLevel(
        ctx,
        network.levels[i],
        left,
        levelTop,
        width,
        levelHeight,
        i == network.levels.length - 1 ? outputLabels : []
      );
    }
  }

  static drawLevel(ctx, level, left, top, width, height, outputLabels) {
    const right = left + width;
    const bottom = top + height;

    const { inputs, outputs, weights, biases } = level;

    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
        ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);
        ctx.lineWidth = 2;
        ctx.strokeStyle = getRGBA(weights[i][j]);
        ctx.stroke();
      }
    }

    const threshold = 10;
    const nodeRadius = 22;
    const smallNodeRadius = 3;
    const outputNodeRadius =
      outputs.length > threshold ? smallNodeRadius : nodeRadius;
    const inputNodeRadius =
      inputs.length > threshold ? smallNodeRadius : nodeRadius;

    for (let i = 0; i < inputs.length; i++) {
      const x = Visualizer.#getNodeX(inputs, i, left, right);
      ctx.beginPath();
      ctx.arc(
        x,
        bottom,
        inputs.length > 10 ? inputNodeRadius : nodeRadius,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "black";
      ctx.fill();
    }
    for (let i = 0; i < inputs.length; i++) {
      const x = Visualizer.#getNodeX(inputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, bottom, inputNodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(inputs[i]);
      ctx.fill();
    }

    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNodeX(outputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, top, outputNodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
    }

    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNodeX(outputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, top, outputNodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      if (outputLabels[i]) {
        const size = outputNodeRadius * 1.2;
        ctx.drawImage(
          outputLabels[i],
          x - size / 2,
          top - size / 2 + size * 0.04,
          size,
          size
        );
      }

      ctx.beginPath();
      ctx.arc(x, top, outputNodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(outputs[i]);
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x, top, outputNodeRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBA(biases[i]);
      ctx.stroke();
    }
  }

  static #getNodeX(nodes, index, left, right) {
    return lerp(
      left,
      right,
      nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}

function lerp(A, B, t) {
  return A + (B - A) * t;
}

function getRGBA(value, maxAlpha = 0.8) {
  const alpha = Math.min(maxAlpha, Math.abs(value));
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;
  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}
