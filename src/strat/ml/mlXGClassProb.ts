import * as XGBoost_ from "ml-xgboost";
// const XGBoost_ = require("ml-xgboost");
import * as mlUtils from "./mlUtils";
import * as mlEvaluate from "./mlEvaluate";
import { FnGetFeature } from "../features";
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

  let testData = features.map((x, i) => ({ features: x, label: labels[i] }));
  const labelCount = mlUtils.countLabels(uniqueLabels, labels);
  // mlUtils.logLabels(uniqueLabels, labels);
  // testData = mlUtils.middlesample(testData, labelCount, 500);
  const avgLabelCount = Math.round(mlUtils.sumLabels(uniqueLabels, labels) / uniqueLabels.length);
  mlUtils.logLabelsInline(labelCount, avgLabelCount);

  testData = mlUtils.middlesample(testData, labelCount, avgLabelCount);

  features = testData.map(x => x.features);
  labels = testData.map(x => x.label);

  // features = mlUtils.rescaleFeatures(features); // NOT NEEDED BECAUSE XG TREE

  const XGBoost = await XGBoost_;
  const booster = new XGBoost({
    booster: "gbtree",
    objective: "multi:softprob",
    // max_depth: 20,
    max_depth: 5,
    // eta: 0.1,
    eta: 0.3, // default 0.3, range [0,1]
    // gamma: 10,
    min_child_weight: 1,
    // subsample: 1,
    subsample: 0.5,
    colsample_bytree: 1,
    silent: 1,
    // iterations: 50,
    iterations: 30,
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

  const predicted = booster.predict(features) as number[][];

  // console.log("PROB_35", JSON.stringify(getProbArr(predicted, 0.35)));
  // console.log("PROB_40", JSON.stringify(getProbArr(predicted, 0.4)));
  // console.log("PROB_50", JSON.stringify(getProbArr(predicted, 0.5)));
  // console.log("PROB_60", JSON.stringify(getProbArr(predicted, 0.6)));
  // console.log("PROB_80", JSON.stringify(getProbArr(predicted, 0.8)));
  // console.log("PROB_90", JSON.stringify(getProbArr(predicted, 0.9)));

  const { xLabels, xPredicted } = getPredictionsOverX(labels, predicted, 0.5);
  const results = mlEvaluate.evaluateResults(uniqueLabels, xLabels, xPredicted);

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
