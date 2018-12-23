// book page 66
import * as tf from "@tensorflow/tfjs";
import { ModelLSTM } from "./common";
import { splitFrames } from "./splitFrames";

// doesn't stop :/

const model: ModelLSTM = {
  createModel: (batchSize: number, featureCount: number) => {
    const model = tf.sequential();

    model.add(
      tf.layers.lstm({
        units: 8,
        inputShape: [batchSize, featureCount]
      })
    );

    model.add(tf.layers.dense({ units: 1, activation: "softmax" }));

    model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

    return model;
  },

  getInput: (features: number[][], labels: number[], batchSize: number, featureCount: number) => {
    const trainBatches = splitFrames(features, labels, batchSize);
    const tfInput = tf.tensor3d(trainBatches.map(x => x.features), [trainBatches.length, batchSize, featureCount]);
    const tfOutput = tf.tensor2d(trainBatches.map(x => x.labels[x.labels.length - 1]), [trainBatches.length, 1]);
    return { tfInput, tfOutput, trainBatches };
  }
};

export default model;
