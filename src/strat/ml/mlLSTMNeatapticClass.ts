import * as neataptic from "neataptic";
import * as mlUtils from "./mlUtils";
import * as mlEvaluate from "./mlEvaluate";
import { FnGetFeature } from "../features";
import { CorrCandles } from "../corr/CorrCandles";
import { mlGetLabels } from "./mlGetLabels";
import { RunConfig } from "../run/runConfig";

export const train = async (runConfig: RunConfig, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  try {
    return await train_(runConfig, corrCandles, fnGetFeature);
  } catch (err) {
    console.error(err.stack);
    throw new Error(err);
  }
};

const uniqueLabels = [0, 1, 2];

export const train_ = async (runConfig: RunConfig, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  let labels = mlGetLabels(corrCandles, runConfig);

  let testData = features.map((x, i) => ({ features: x, label: labels[i] }));
  testData = mlUtils.middlesample(testData, runConfig);

  features = testData.map(x => x.features);
  labels = testData.map(x => x.label);

  features = mlUtils.rescaleFeatures(features);

  const net = new neataptic.architect.LSTM(1, 6, 1);

  let data = features.map((x, i) => ({
    input: x,
    output: [labels[i]]
  }));

  net.train(data, {
    // log: 1, // 500,
    iterations: 100,
    error: 0.05,
    clear: true,
    rate: 0.05,
    shuffle: true // !!!
  });

  return { net, features, labels };
};

// let's not complicate, just go full cycle, getting features/labels is fast anyway
export const predict = (runConfig: RunConfig, net: any, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  let labels = mlGetLabels(corrCandles, runConfig);

  features = mlUtils.rescaleFeatures(features);

  const predicted = features.map(x => net.activate(x) as number[]).map(x => x[0]);

  const results = mlEvaluate.evaluateResults(uniqueLabels, labels, predicted);

  return { net, features, labels, predicted, results };
};
