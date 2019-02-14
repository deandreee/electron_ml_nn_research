import * as XGBoost_ from "ml-xgboost";
// const XGBoost_ = require("ml-xgboost");
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

export const train_ = async (runConfig: RunConfig, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);

  let labels = mlGetLabels(corrCandles, runConfig);
  let testData = features.map((x, i) => ({ features: x, label: labels[i] }));
  testData = mlUtils.upsample(testData, runConfig);

  // features = mlUtils.rescaleFeatures(features); // NOT NEEDED BECAUSE XG TREE

  const XGBoost = await XGBoost_;

  const xgProps: any = {
    booster: "gbtree",
    objective: runConfig.XG_OBJECTIVE || "multi:softmax",
    eta: runConfig.XG.eta || 0.3,
    gamma: runConfig.XG.gamma || 0,
    max_depth: runConfig.XG.max_depth || 3,
    min_child_weight: runConfig.XG.min_child_weight || 1,
    subsample: runConfig.XG.subsample || 0.5,
    iterations: runConfig.XG.iterations || 10,

    colsample_bytree: runConfig.XG.colsample_bytree || 1,

    verbosity: 1 // 0 (silent), 1 (warning), 2 (info), 3 (debug).
  };

  if (runConfig.XG_OBJECTIVE.startsWith("multi:")) {
    xgProps.num_class = runConfig.UNIQUE_LABELS.length;
  }

  const booster = new XGBoost(xgProps);

  booster.train(features, labels);

  return { booster, features, labels };
};

export interface EvalResults {
  clasifResults?: mlEvaluate.ClasifResults;
  regResults?: mlEvaluate.RegResults;
}

export interface PredictResults {
  booster: any;
  features: number[][];
  labels: number[];
  predicted: number[];
  results: EvalResults;
}

// let's not complicate, just go full cycle, getting features/labels is fast anyway
export const predict = (
  runConfig: RunConfig,
  booster: any,
  corrCandles: CorrCandles,
  fnGetFeature: FnGetFeature
): PredictResults => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  let labels = mlGetLabels(corrCandles, runConfig);

  // features = mlUtils.rescaleFeatures(features); // NOT NEEDED BECAUSE XG TREE

  const predicted = booster.predict(features);
  if (runConfig.XG_OBJECTIVE.endsWith(":logistic")) {
    const predictedRound = predicted.map((x: number) => (x > runConfig.PRED_PROB ? 1 : 0));
    const clasifResults = mlEvaluate.evalClasif(runConfig.UNIQUE_LABELS, labels, predictedRound);
    return { booster, features, labels, predicted: predictedRound, results: { clasifResults } };
  } else if (runConfig.XG_OBJECTIVE.startsWith("multi:")) {
    const clasifResults = mlEvaluate.evalClasif(runConfig.UNIQUE_LABELS, labels, predicted);
    return { booster, features, labels, predicted, results: { clasifResults } };
  } else {
    // regression
    const regResults = mlEvaluate.evalReg(labels, predicted);
    return { booster, features, labels, predicted, results: { regResults } };
  }
};
