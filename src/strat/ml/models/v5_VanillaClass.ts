// book page 66
import * as tf from "@tensorflow/tfjs";
import { ModelLSTM } from "./common";
import { splitFrames } from "./splitFrames";
import * as common from "./common";

// doesn't stop :/
// always return 1 with both formatOutput2d versions

const model: ModelLSTM = {
  createModel: (batchSize: number, featureCount: number, labelCount: number) => {
    const model = tf.sequential();

    model.add(
      tf.layers.lstm({
        // units: featureCount,
        units: 4,
        inputShape: [batchSize, featureCount]
      })
    );

    model.add(tf.layers.dense({ units: labelCount, activation: "softmax" }));

    model.compile(common.compileClassAdam());
    // model.compile(common.compileClassSgd());

    // console.log(model.summary());

    return model;
  },

  getInput: (features: number[][], labels: number[], batchSize: number, featureCount: number, labelCount: number) => {
    const trainBatches = splitFrames(features, labels, batchSize);

    const tfInput = common.formatInput3d(trainBatches, batchSize, featureCount);
    const tfOutput = common.formatOutput2d_oneHotEncoded(trainBatches, batchSize, labelCount);

    return { tfInput, tfOutput, trainBatches };
  },

  decodePrediction: async (tfPrediction: tf.Tensor, sampleCount: number) => {
    return common.decodeSoftmaxPrediciton(tfPrediction, sampleCount);
  }
};

export default model;
