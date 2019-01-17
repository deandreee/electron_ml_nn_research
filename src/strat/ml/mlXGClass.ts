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

  // middlesample
  const labelCount = mlUtils.countLabels(UNIQUE_LABELS, labels);
  const avgLabelCount = Math.round(mlUtils.sumLabels(UNIQUE_LABELS, labels) / UNIQUE_LABELS.length);
  // mlUtils.logLabelsInline(labelCount, avgLabelCount);
  testData = mlUtils.middlesample(testData, labelCount, avgLabelCount);

  features = testData.map(x => x.features);
  labels = testData.map(x => x.label);

  // features = mlUtils.rescaleFeatures(features); // NOT NEEDED BECAUSE XG TREE

  const XGBoost = await XGBoost_;
  const booster = new XGBoost({
    booster: "gbtree",
    objective: "multi:softmax",
    eta: runConfigXG.eta || 0.3,
    gamma: runConfigXG.gamma || 0,
    max_depth: runConfigXG.max_depth || 3,
    min_child_weight: runConfigXG.min_child_weight || 1,
    subsample: runConfigXG.subsample || 0.5,
    iterations: runConfigXG.iterations || 10,

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

  const results = mlEvaluate.evaluateResults(UNIQUE_LABELS, labels, predicted);

  return { booster, features, labels, predicted, results };
};
