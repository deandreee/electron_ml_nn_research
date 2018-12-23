import * as tf from "@tensorflow/tfjs";
require("@tensorflow/tfjs-node"); // just add the binding

import * as mlUtils from "./mlUtils";
import * as mlEvaluate from "./mlEvaluate";
import { FnGetFeature } from "../features";
import { CorrCandles } from "../corr/CorrCandles";
import { mlGetLabels } from "./mlGetLabels";
import model from "./models/v5_Vanilla";

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

export const train_ = async (corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  let labels = mlGetLabels(corrCandles);

  features = mlUtils.rescaleFeatures(features);
  const featureCount = features[0].length;

  const net = model.createModel(BATCH_SIZE, featureCount);
  const { tfInput, tfOutput } = model.getInput(features, labels, BATCH_SIZE, featureCount);

  await net.fit(tfInput, tfOutput, { epochs: 5, batchSize: 1 });

  // const predicted = Array.from(await (net.predict(tfInput) as tf.Tensor<tf.Rank>).data());
  // console.log(predicted[0]);

  return { net, features, labels };
};

// let's not complicate, just go full cycle, getting features/labels is fast anyway
export const predict = async (net: tf.Sequential, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  let labels = mlGetLabels(corrCandles);

  features = mlUtils.rescaleFeatures(features);
  const featureCount = features[0].length;
  const { tfInput, trainBatches } = model.getInput(features, labels, BATCH_SIZE, featureCount);
  const output = trainBatches.map(x => x.labels[x.labels.length - 1]);

  const predicted = Array.from(await (net.predict(tfInput) as tf.Tensor<tf.Rank>).data());
  const results = mlEvaluate.evaluateResults(uniqueLabels, output, predicted);

  return { net, features, labels, predicted, results };
};
