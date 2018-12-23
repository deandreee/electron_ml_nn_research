import * as tf from "@tensorflow/tfjs";
import { TrainBatch } from "./splitFrames";

export interface ModelInput {
  tfInput: tf.Tensor;
  tfOutput: tf.Tensor;
  trainBatches: TrainBatch[];
}

export interface ModelLSTM {
  createModel: (batchSize: number, featureCount: number) => tf.Sequential;
  getInput: (features: number[][], labels: number[], batchSize: number, featureCount: number) => ModelInput;
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
export const formatOutput2d_WithShape = (trainBatches: TrainBatch[]) => {
  return tf.tensor2d(trainBatches.map(x => x.labels[x.labels.length - 1]), [trainBatches.length, 1]);
};

export const formatOutput2d_withShape_asArray = (trainBatches: TrainBatch[]) => {
  return tf.tensor2d(trainBatches.map(x => [x.labels[x.labels.length - 1]]), [trainBatches.length, 1]);
};

export const formatOutput3d_oneZeroEncoded = (trainBatches: TrainBatch[], batchSize: number, labelCount: number) => {
  return tf.tensor3d(trainBatches.map(x => x.labels.map(x => mapLabel3d(x))), [
    trainBatches.length,
    batchSize,
    labelCount
  ]);
};
