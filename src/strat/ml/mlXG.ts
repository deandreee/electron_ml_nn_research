import * as XGBoost_ from "ml-xgboost";
// const XGBoost_ = require("ml-xgboost");
import * as mlUtils from "./mlUtils";
import * as mlEvaluate from "./mlEvaluate";
import { FnGetFeature } from "../features";
import { CorrCandles } from "../corr/CorrCandles";
import { round2 } from "../utils";
import { mlGetLabels } from "./mlGetLabels";
import { RunConfig } from "../run/config/runConfig";

export const train = async (runConfig: RunConfig, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  try {
    return await train_(runConfig, corrCandles, fnGetFeature);
  } catch (err) {
    console.error(err.stack);
    throw new Error(err);
  }
};

export const train_ = async (runConfig: RunConfig, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  let labels = mlGetLabels(corrCandles, runConfig);

  // const filtered = mlUtils.filterByLabels(features, labels, 3);
  // features = filtered.features;
  // labels = filtered.labels;

  features = mlUtils.rescaleFeatures(features);
  labels = labels.map(x => round2(x));

  const XGBoost = await XGBoost_;
  const booster = new XGBoost({
    booster: "gbtree",
    objective: "reg:linear",
    max_depth: 5,
    eta: 0.1,
    min_child_weight: 1,
    subsample: 0.5,
    colsample_bytree: 1,
    silent: 1,
    iterations: 200
  });

  booster.train(features, labels);

  return { booster, features, labels };
};

// let's not complicate, just go full cycle, getting features/labels is fast anyway
export const predict = (runConfig: RunConfig, booster: any, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  let labels = mlGetLabels(corrCandles, runConfig);

  features = mlUtils.rescaleFeatures(features);
  labels = labels.map(x => round2(x));

  const predicted = booster.predict(features);

  const { mse } = mlEvaluate.evalRegMSE(labels, predicted);
  const { r2 } = mlEvaluate.evalRegR2(labels, predicted);

  return { booster, features, labels, predicted, mse, r2 };
};
