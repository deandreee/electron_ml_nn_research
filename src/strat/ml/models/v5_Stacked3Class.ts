// book page 66
import * as tf from "@tensorflow/tfjs";
import { ModelLSTM } from "./common";
// import { splitFrames } from "./splitFrames";
import * as common from "./common";
import v5 from "./v5_VanillaClass";

// doesn't stop :/
// always return 1 with both formatOutput2d versions

const model: ModelLSTM = {
  createModel: (batchSize: number, featureCount: number, labelCount: number) => {
    const model = tf.sequential();

    model.add(
      tf.layers.lstm({
        units: 4,
        inputShape: [batchSize, featureCount],
        returnSequences: true
      })
    );

    model.add(
      tf.layers.lstm({
        units: 4,
        returnSequences: true
      })
    );

    model.add(
      tf.layers.lstm({
        units: 4
      })
    );

    model.add(tf.layers.dense({ units: labelCount, activation: "softmax" }));

    model.compile(common.compileClassAdam());

    // console.log(model.summary());

    return model;
  },

  getInput: v5.getInput,
  decodePrediction: v5.decodePrediction
};

export default model;
