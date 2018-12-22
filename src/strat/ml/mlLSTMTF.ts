import * as tf from "@tensorflow/tfjs";
require("@tensorflow/tfjs-node"); // just add the binding

import * as mlUtils from "./mlUtils";
import * as mlEvaluate from "./mlEvaluate";
import { FnGetFeature } from "../features";
import { CorrCandles } from "../corr/CorrCandles";
import { mlGetLabels } from "./mlGetLabels";
import { splitFrames } from "./splitFrames";

export const train = async (corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  try {
    return await train_(corrCandles, fnGetFeature);
  } catch (err) {
    console.error(err.stack);
    throw new Error(err);
  }
};

const uniqueLabels = [0, 1, 2];
const BATCH_SIZE = 100;

export const createModel = (featureCount: number) => {
  const model = tf.sequential();

  const hidden = tf.layers.lstm({
    units: featureCount,
    activation: "sigmoid",

    // input_shape is supposed to be (timesteps, n_features). Remove the first dimension.
    // input_shape = (95000,360)
    // inputShape: [100, featureCount],
    inputShape: [BATCH_SIZE, featureCount],

    // inputShape: [featureCount, 1],
    // inputShape: [featureCount],
    returnSequences: true
  });
  model.add(hidden);

  // output layer
  const output = tf.layers.lstm({
    units: 1,
    activation: "sigmoid",
    // hmm maybe this for flat output ?
    returnSequences: false
    // returnSequences: true
  });
  model.add(output);

  // usually eveywhere output type is dense, let's try
  // const output = tf.layers.dense({ units: 1, activation: "softmax" });
  // model.add(output);

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

  return model;
};

export const train_ = async (corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  let labels = mlGetLabels(corrCandles);

  let testData = features.map((x, i) => ({ features: x, label: labels[i] }));
  const labelCount = mlUtils.countLabels(uniqueLabels, labels);
  // mlUtils.logLabels(uniqueLabels, labels);
  // testData = mlUtils.middlesample(testData, labelCount, 500);
  const avgLabelCount = Math.round(mlUtils.sumLabels(uniqueLabels, labels) / uniqueLabels.length);
  mlUtils.logLabelsInline(labelCount, avgLabelCount);

  testData = mlUtils.middlesample(testData, labelCount, avgLabelCount);

  const trainBatches = splitFrames(features, labels, BATCH_SIZE);

  features = mlUtils.rescaleFeatures(features);
  const featureCount = features[0].length;

  const net = createModel(featureCount);

  const input = tf.tensor3d(trainBatches.map(x => x.features), [trainBatches.length, BATCH_SIZE, featureCount]);

  // only take last, becaise with 100 with no overlaps we have just 44 samples
  const output = tf.tensor2d(trainBatches.map(x => [x.labels[x.labels.length - 1]]), [trainBatches.length, 1]);

  await net.fit(input, output);

  return { net, features, labels };
};

// let's not complicate, just go full cycle, getting features/labels is fast anyway
export const predict = async (net: tf.Sequential, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  let labels = mlGetLabels(corrCandles);

  features = mlUtils.rescaleFeatures(features);

  const inputTensor = tf.tensor3d([features.slice(0, 100)], [1, 100, features[0].length]);
  const x = net.predict(inputTensor) as tf.Tensor<tf.Rank>;
  // console.log(tf.reshape([x], [-1]));
  console.log(await x.data());
  // const x = tf.squeeze(predicted.slice([0]));
  // const x = predicted.print();
  // predicted.toString();

  const predicted: number[] = [];

  // const predicted = await Promise.all(features.map(x => net.predict(x) as number));
  const results = mlEvaluate.evaluateResults(uniqueLabels, labels, predicted);

  return { net, features, labels, predicted, results };
};
