import * as tf from "@tensorflow/tfjs";
// import "@tensorflow/tfjs-node"; // just add the binding
// import "@tensorflow/tfjs-node-gpu"; // just add the binding

import * as mlUtils from "./mlUtils";
import * as mlEvaluate from "./mlEvaluate";
import { FnGetFeature } from "../features";
import { CorrCandles } from "../corr/CorrCandles";
import { mlGetLabels } from "./mlGetLabels";
// import model from "./models/v5_Vanilla";
import model from "./models/v5_VanillaClass";
// import model from "./models/v5_Stacked2Class";
// import model from "./models/v5_Stacked3Class";
import * as log from "../log";
import { getClassWeights } from "./models/common";
import { MinMaxScaler } from "../features/MinMaxScaler";

export const train = async (corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  try {
    return await train_(corrCandles, fnGetFeature);
  } catch (err) {
    console.error(err.stack);
    throw new Error(err);
  }
};

const uniqueLabels = [0, 1, 2];
const BATCH_SIZE = 50;

export const train_ = async (corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  let labels = mlGetLabels(corrCandles);

  const minMaxScaler = new MinMaxScaler(fnGetFeature);
  features = minMaxScaler.scaleInitial(features);

  const featureCount = features[0].length;
  const labelCount = uniqueLabels.length;

  const net = model.createModel(BATCH_SIZE, featureCount, labelCount);
  const { tfInput, tfOutput, trainBatches } = model.getInput(features, labels, BATCH_SIZE, featureCount, labelCount);

  const classWeight = getClassWeights(uniqueLabels, trainBatches);
  // const classWeight: any = undefined;

  log.time("FIT");
  const batchSize: any = undefined;
  // const batchSize = 10;
  await net.fit(tfInput, tfOutput, { epochs: 20, batchSize, classWeight });
  log.timeEnd("FIT");

  // const predicted = Array.from(await (net.predict(tfInput) as tf.Tensor<tf.Rank>).data());
  // console.log(predicted[0]);

  return { net, features, labels, minMaxScaler };
};

// let's not complicate, just go full cycle, getting features/labels is fast anyway
export const predict = async (
  net: tf.Sequential,
  corrCandles: CorrCandles,
  fnGetFeature: FnGetFeature,
  minMaxScaler: MinMaxScaler
) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  let labels = mlGetLabels(corrCandles);

  features = minMaxScaler.scale(features);

  const featureCount = features[0].length;
  const labelCount = uniqueLabels.length;

  const { tfInput, trainBatches } = model.getInput(features, labels, BATCH_SIZE, featureCount, labelCount);
  const labelsLast = trainBatches.map(x => x.labels[x.labels.length - 1]);

  const tfPredicted = await (net.predict(tfInput) as tf.Tensor<tf.Rank>);
  const predicted = await model.decodePrediction(tfPredicted, trainBatches.length);

  const results = mlEvaluate.evaluateResults(uniqueLabels, labelsLast, predicted);

  return { net, features, labels, predicted, results };
};
