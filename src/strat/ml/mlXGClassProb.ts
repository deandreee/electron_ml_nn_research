import * as XGBoost_ from "ml-xgboost";
// const XGBoost_ = require("ml-xgboost");
import * as mlUtils from "./mlUtils";
import * as mlEvaluate from "./mlEvaluate";
import { FnGetFeature } from "../features";
import { CorrCandles } from "../corr/CorrCandles";
// import { round2 } from "./utils";
import { mlGetLabels } from "./mlGetLabels";
import { RunConfigXG, UNIQUE_LABELS } from "../run/runConfigXG";

export const train = async (runConfigXG: RunConfigXG, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  try {
    return await train_(runConfigXG, corrCandles, fnGetFeature);
  } catch (err) {
    console.error(err.stack);
    throw new Error(err);
  }
};

export const train_ = async (runConfigXG: RunConfigXG, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  let labels = mlGetLabels(corrCandles);

  let testData = features.map((x, i) => ({ features: x, label: labels[i] }));
  testData = mlUtils.upsample(testData, UNIQUE_LABELS);

  features = testData.map(x => x.features);
  labels = testData.map(x => x.label);

  // features = mlUtils.rescaleFeatures(features); // NOT NEEDED BECAUSE XG TREE

  const XGBoost = await XGBoost_;
  const booster = new XGBoost({
    booster: "gbtree",
    objective: "multi:softprob",
    eta: runConfigXG.eta || 0.3,
    gamma: runConfigXG.gamma || 0,
    max_depth: runConfigXG.max_depth || 3,
    min_child_weight: runConfigXG.min_child_weight || 1,
    subsample: runConfigXG.subsample || 0.5,
    iterations: runConfigXG.iterations || 10,

    colsample_bytree: runConfigXG.colsample_bytree || 1,

    verbosity: 1, // 0 (silent), 1 (warning), 2 (info), 3 (debug).
    num_class: UNIQUE_LABELS.length
  });

  booster.train(features, labels);

  return { booster, features, labels };
};

// let's not complicate, just go full cycle, getting features/labels is fast anyway
export const predict = (booster: any, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  let labels = mlGetLabels(corrCandles);

  // features = mlUtils.rescaleFeatures(features); // NOT NEEDED BECAUSE XG TREE

  const predicted = booster.predict(features);

  const { xLabels, xPredicted } = getPredictionsOverX(labels, predicted, 0.5);
  const results = mlEvaluate.evaluateResults(UNIQUE_LABELS, xLabels, xPredicted);

  return { booster, features, labels, predicted: xPredicted, results };
};

export const getProbArr = (predicted: number[][], prob: number) => {
  const cert_0 = getProbCount(predicted, 0, prob);
  const cert_1 = getProbCount(predicted, 1, prob);
  const cert_2 = getProbCount(predicted, 2, prob);
  return [cert_0, cert_1, cert_2];
};

const getProbCount = (predicted: number[][], label: number, prob: number) => {
  return predicted.filter((x: number[]) => x[label] > prob).length;
};

const getPredictionsOverX = (labels: number[], predicted: number[][], prob: number) => {
  const xLabels = [];
  const xPredicted = [];

  for (let i = 0; i < predicted.length; i++) {
    if (predicted[i][0] > prob) {
      xLabels.push(labels[i]);
      xPredicted.push(0);
    }

    if (predicted[i][1] > prob) {
      xLabels.push(labels[i]);
      xPredicted.push(1);
    }

    if (predicted[i][2] > prob) {
      xLabels.push(labels[i]);
      xPredicted.push(2);
    }
  }

  return { xLabels, xPredicted };
};
