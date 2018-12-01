import * as XGBoost_ from "ml-xgboost";
// const XGBoost_ = require("ml-xgboost");
import * as mlUtils from "./mlUtils";
import * as mlEvaluate from "./mlEvaluate";
import { FnGetFeature } from "./mlGetFeatures";
import { CorrCandles } from "../corr/CorrCandles";
// import { round2 } from "./utils";
import { mlGetLabels } from "./mlGetLabels";

export const train = async (corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  try {
    return await train_(corrCandles, fnGetFeature);
  } catch (err) {
    console.error(err.stack);
    throw new Error(err);
  }
};

const uniqueLabels = [0, 1, 2];

export const train_ = async (corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  let labels = mlGetLabels(corrCandles);

  const labelCount = mlUtils.countLabels(uniqueLabels, labels);
  mlUtils.logLabels(uniqueLabels, labels);
  let testData = features.map((x, i) => ({ features: x, label: labels[i] }));
  testData = mlUtils.middlesample(testData, labelCount, 500);

  features = testData.map(x => x.features);
  labels = testData.map(x => x.label);

  features = mlUtils.rescaleFeatures(features);

  const XGBoost = await XGBoost_;
  const booster = new XGBoost({
    booster: "gbtree",
    objective: "multi:softmax",
    max_depth: 5,
    eta: 0.1,
    min_child_weight: 1,
    subsample: 1,
    colsample_bytree: 1,
    silent: 1,
    iterations: 10,
    // iterations: 10,
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

  features = mlUtils.rescaleFeatures(features);

  const predicted = booster.predict(features);

  const results = mlEvaluate.evaluateResults(uniqueLabels, labels, predicted);

  return { booster, features, labels, predicted, results };
};
