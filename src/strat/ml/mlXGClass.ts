import * as XGBoost_ from "ml-xgboost";
// const XGBoost_ = require("ml-xgboost");
import * as mlUtils from "./mlUtils";
import * as mlEvaluate from "./mlEvaluate";
import { FnGetFeature } from "../features";
import { CorrCandles } from "../corr/CorrCandles";
// import { round2 } from "./utils";
import { mlGetLabels } from "./mlGetLabels";
import { RunConfigXG } from "../run/runConfigXG";

export const train = async (runConfigXG: RunConfigXG, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  try {
    return await train_(runConfigXG, corrCandles, fnGetFeature);
  } catch (err) {
    console.error(err.stack);
    throw new Error(err);
  }
};

const uniqueLabels = [0, 1, 2];

export const train_ = async (runConfigXG: RunConfigXG, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  let labels = mlGetLabels(corrCandles);

  let testData = features.map((x, i) => ({ features: x, label: labels[i] }));
  const labelCount = mlUtils.countLabels(uniqueLabels, labels);
  // mlUtils.logLabels(uniqueLabels, labels);
  // testData = mlUtils.middlesample(testData, labelCount, 500);
  const avgLabelCount = Math.round(mlUtils.sumLabels(uniqueLabels, labels) / uniqueLabels.length);
  // mlUtils.logLabelsInline(labelCount, avgLabelCount);

  testData = mlUtils.middlesample(testData, labelCount, avgLabelCount);

  features = testData.map(x => x.features);
  labels = testData.map(x => x.label);

  // features = mlUtils.rescaleFeatures(features); // NOT NEEDED BECAUSE XG TREE

  const XGBoost = await XGBoost_;
  const booster = new XGBoost({
    booster: "gbtree",
    objective: "multi:softmax",
    // max_depth: 20,
    max_depth: runConfigXG.max_depth || 3,
    // eta: 0.1,
    eta: runConfigXG.max_depth || 0.01,
    // gamma: 10,
    // min_child_weight: 1,
    // subsample: 1,
    subsample: 0.5,
    colsample_bytree: 1,
    silent: 1,
    // iterations: 50,
    iterations: 10,
    num_class: uniqueLabels.length
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

  const results = mlEvaluate.evaluateResults(uniqueLabels, labels, predicted);

  return { booster, features, labels, predicted, results };
};
