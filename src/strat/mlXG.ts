import * as XGBoost_ from "ml-xgboost";
import * as mlUtils from "./mlUtils";
import * as mlEvaluate from "./mlEvaluate";
import { FnGetFeature } from "./getFeatures";
import { CorrCandles } from "./corrCalc";
import { round2 } from "./utils";

const getLabels = (corrCandles: CorrCandles) => {
  return corrCandles.candlesActual.map(x => x.pctChange._24h);
};

export const predict = async (corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  try {
    return await predict_(corrCandles, fnGetFeature);
  } catch (err) {
    console.error(err.stack);
    throw new Error(err);
  }
};

export const predict_ = async (corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => [fnGetFeature(x, i, corrCandles)]);
  features.forEach(mlUtils.sanityCheckRow);
  let labels = getLabels(corrCandles);
  features = mlUtils.rescaleFeatures(features);
  labels = labels.map(x => round2(x));

  const XGBoost = await XGBoost_;
  const booster = new XGBoost({
    booster: "gbtree",
    // objective: "multi:softmax",
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
  const predicted = booster.predict(features);

  //   booster.free();

  const { mse } = mlEvaluate.evalRegMSE(labels, predicted);
  const { r2 } = mlEvaluate.evalRegR2(labels, predicted);
  const evalCorr = mlEvaluate.evalRegCorr(labels, predicted);

  return { booster, labels, predicted, mse, r2, evalCorr };
};

export const predictAnotherMonth = (booster: any, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => [fnGetFeature(x, i, corrCandles)]);
  features.forEach(mlUtils.sanityCheckRow);

  let labels = getLabels(corrCandles);

  features = mlUtils.rescaleFeatures(features);
  labels = labels.map(x => round2(x));

  const predicted = booster.predict(features);

  const { mse } = mlEvaluate.evalRegMSE(labels, predicted);
  const { r2 } = mlEvaluate.evalRegR2(labels, predicted);
  const evalCorr = mlEvaluate.evalRegCorr(labels, predicted);

  return { booster, labels, predicted, mse, r2, evalCorr };
};
