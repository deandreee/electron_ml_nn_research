import * as tf from "@tensorflow/tfjs";
import { TrainBatch } from "./splitFrames";
import { ModelCompileConfig } from "@tensorflow/tfjs";

export interface ModelInput {
  tfInput: tf.Tensor;
  tfOutput: tf.Tensor;
  trainBatches: TrainBatch[];
}

export interface ModelLSTM {
  createModel: (batchSize: number, featureCount: number, labelCount: number) => tf.Sequential;
  getInput: (
    features: number[][],
    labels: number[],
    batchSize: number,
    featureCount: number,
    labelCount: number
  ) => ModelInput;
}

export const mapLabel3d = (label: number) => {
  if (label === 0) {
    return [1, 0, 0];
  }
  if (label === 1) {
    return [0, 1, 0];
  }
  if (label === 2) {
    return [0, 0, 1];
  }

  throw new Error("Unknown label: " + label);
};

// only take last, becaise with 100 with no overlaps we have just 44 samples
export const formatOutput2d_withShape = (trainBatches: TrainBatch[]) => {
  return tf.tensor2d(trainBatches.map(x => x.labels[x.labels.length - 1]), [trainBatches.length, 1]);
};

export const formatOutput2d_withShape_asArray = (trainBatches: TrainBatch[]) => {
  return tf.tensor2d(trainBatches.map(x => [x.labels[x.labels.length - 1]]), [trainBatches.length, 1]);
};

export const formatOutput3d_oneHotEncoded = (trainBatches: TrainBatch[], batchSize: number, labelCount: number) => {
  return tf.tensor3d(trainBatches.map(x => x.labels.map(x => mapLabel3d(x))), [
    trainBatches.length,
    batchSize,
    labelCount
  ]);
};

export const formatInput3d = (trainBatches: TrainBatch[], batchSize: number, featureCount: number) => {
  return tf.tensor3d(trainBatches.map(x => x.features), [trainBatches.length, batchSize, featureCount]);
};

export const compileClassAdam = (): ModelCompileConfig => {
  return { loss: "categoricalCrossentropy", optimizer: "adam", metrics: ["acc"] };
};

export const compileRegSgd = (): ModelCompileConfig => {
  return { loss: "meanSquaredError", optimizer: "sgd" };
};
