import { NumberMap } from "./mlUtils";
import { padEnd, sum, meanBy } from "lodash";
import { round2 } from "../utils";

// * Precision/Specificity: how many selected instances are relevant.
// * Recall/Sensitivity: how many relevant instances are selected.
// * F1 score: harmonic mean of precision and recall.

export interface ClasifResults {
  fScore: number;
  precision: NumberMap;
  precisionTotal: number;
  recall: NumberMap;
  recallTotal: number;
  hitRate: number;
  bigErrorsReverse: number;
  zeroHitRate: HitRate;
  oneHitRate: HitRate;
  twoHitRate: HitRate;
}

export const evalClasif = (uniqueLabels: number[], labels: number[], predicted: number[]): ClasifResults => {
  let truePositives: NumberMap = {};
  let falsePositives: NumberMap = {};
  let falseNegatives: NumberMap = {};
  let hitCount = 0;
  let bigErrorsCount = 0; // 1 -> -1 and otherwise

  for (let x of uniqueLabels) {
    truePositives[x] = 0;
    falsePositives[x] = 0;
    falseNegatives[x] = 0;
  }

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];

    if (labels[i] === predicted[i]) {
      truePositives[label]++;
      hitCount++;
    } else {
      falsePositives[predicted[i]]++; // is, but but have not been
      falseNegatives[labels[i]]++; // should have been, but is not
    }

    if (labels[i] === 0 && predicted[i] === 2) {
      bigErrorsCount++;
    } else if (labels[i] === 2 && predicted[i] === 0) {
      bigErrorsCount++;
    }
  }

  let precision: NumberMap = {};
  let recall: NumberMap = {};
  for (let x of uniqueLabels) {
    const px = truePositives[x] / (truePositives[x] + falsePositives[x]);
    const rx = truePositives[x] / (truePositives[x] + falseNegatives[x]);
    precision[x] = !isNaN(px) ? px : 0;
    recall[x] = !isNaN(rx) ? rx : 0;
  }

  // console.log("preision", precision);

  const precisionTotal = sum(objToArr(precision)) / uniqueLabels.length;
  const recallTotal = sum(objToArr(recall)) / uniqueLabels.length;
  const fScore = (2 * precisionTotal * recallTotal) / (precisionTotal + recallTotal);

  // my custom, simply % of correct
  const hitRate = hitCount / labels.length;
  const bigErrorsReverse = 1 - bigErrorsCount / labels.length;

  const zeroLabels = labels.filter(x => x === 0).length;
  const zeroPredicted = predicted.filter(x => x === 0).length;
  const zeroHitRate = { actual: zeroLabels, predicted: zeroPredicted };

  const oneLabels = labels.filter(x => x === 1).length;
  const onePredicted = predicted.filter(x => x === 1).length;
  const oneHitRate = { actual: oneLabels, predicted: onePredicted };

  const twoLabels = labels.filter(x => x === 2).length;
  const twoPredicted = predicted.filter(x => x === 2).length;
  const twoHitRate = { actual: twoLabels, predicted: twoPredicted };

  // console.log(padEnd("PRECISION_TOTAL", 20), round2(precisionTotal));
  // console.log(padEnd("RECALL_TOTAL", 20), round2(recallTotal));
  // console.log(padEnd("F_SCORE", 20), round2(fScore));

  return {
    fScore,
    precision,
    precisionTotal,
    recall,
    recallTotal,
    hitRate,
    bigErrorsReverse,
    zeroHitRate,
    oneHitRate,
    twoHitRate
  };
};

export interface HitRate {
  actual: number;
  predicted: number;
}

const objToArr = (o: any) => {
  return Object.keys(o).map(x => o[x]);
};

const getGroupX = (x: number, limit: number) => {
  if (x >= limit) {
    return limit;
  } else if (x <= -limit) {
    return -limit;
  }
  return 0;
};

export interface MlEvaluateResults {
  fScore: number;
  precision: NumberMap;
  precisionTotal: number;
  recall: NumberMap;
  recallTotal: number;
}

export const evalClasifInXs = (limit: number, input: number[], output: number[]): MlEvaluateResults => {
  let truePositives: NumberMap = {};
  let falsePositives: NumberMap = {};
  let falseNegatives: NumberMap = {};

  const groups = [-limit, 0, limit];

  for (let x of groups) {
    truePositives[x] = 0;
    falsePositives[x] = 0;
    falseNegatives[x] = 0;
  }

  for (let i = 0; i < input.length; i++) {
    const g1 = getGroupX(input[i], limit);
    const g2 = getGroupX(output[i], limit);

    if (input[i] === output[i]) {
      truePositives[g1]++;
    } else {
      falsePositives[g2]++; // is, but but have not been
      falseNegatives[g1]++; // should have been, but is not
    }
  }

  let precision: NumberMap = {};
  let recall: NumberMap = {};
  for (let x of groups) {
    const px = truePositives[x] / (truePositives[x] + falsePositives[x]);
    const rx = truePositives[x] / (truePositives[x] + falseNegatives[x]);
    precision[x] = !isNaN(px) ? px : 0;
    recall[x] = !isNaN(rx) ? rx : 0;
  }

  // console.log("preision", precision);

  const precisionTotal = sum(objToArr(precision)) / groups.length;
  const recallTotal = sum(objToArr(recall)) / groups.length;
  const fScore = (2 * precisionTotal * recallTotal) / (precisionTotal + recallTotal);

  console.log(`     ----- RESULTS for ${limit} -----     `);
  console.log(padEnd("PRECISION_TOTAL", 20), round2(precisionTotal));
  console.log(padEnd("RECALL_TOTAL", 20), round2(recallTotal));
  console.log(padEnd("F_SCORE", 20), round2(fScore));

  return { fScore, precision, precisionTotal, recall, recallTotal };
};

// Where SSE is the sum of squared errors
export const calcSSE = (labels: number[], predicted: number[]) => {
  let errSum = 0;
  for (let i = 0; i < labels.length; i++) {
    const lbl = labels[i];
    const pred = predicted[i];
    const err = Math.pow(lbl - pred, 2);
    errSum += err;
  }

  return errSum;
};

// SST is the sum of squared errors of our baseline model.
// baseline = average
export const calcSST = (labels: number[]) => {
  const mean = meanBy(labels, x => x);

  let errSum = 0;
  for (let i = 0; i < labels.length; i++) {
    const lbl = labels[i];
    const err = Math.pow(lbl - mean, 2);
    errSum += err;
  }

  return errSum;
};

export const evalRegMSE = (labels: number[], predicted: number[]) => {
  if (labels.length !== predicted.length) {
    throw new Error("evalRegMSE: lengths not equal");
  }

  const errSum = calcSSE(labels, predicted);
  const mse = errSum / labels.length;

  return { mse };
};

// this is the real one, y vs y-pred (or y-hat)
// can be negative, max 1
// https://towardsdatascience.com/coefficient-of-determination-r-squared-explained-db32700d924e
// https://scikit-learn.org/stable/modules/generated/sklearn.metrics.r2_score.html
// A constant model that always
// predicts the expected value of y, disregarding the input features,
// would get a R^2 score of 0.0.
export const evalRegR2 = (labels: number[], predicted: number[]) => {
  if (labels.length !== predicted.length) {
    throw new Error("evalRegMSE: lengths not equal");
  }

  const sse = calcSSE(labels, predicted);
  const sst = calcSST(labels);
  const r2 = 1 - sse / sst;

  return { r2 };
};

// this is completely different beast => x vs y not y_true vs y_pred
// removing to skip confusion, leaving as example
// export const evalRegCorr = (labels: number[], predicted: number[]) => {
//   const linreg = regression.linear(labels.map((w, i) => [labels[i], predicted[i]]));
//   const r2 = linreg.r2;

//   const s1 = new Series(labels);
//   const s2 = new Series(predicted);
//   const corr = round2(s1.corr(s2));

//   return { r2, corr };
// };

export interface CorrResults {
  r2: number;
  corr: number;
}

export interface RegResults {
  mse: number;
  r2: number;
}

export const evalReg = (labels: number[], predicted: number[]): RegResults => {
  const { mse } = evalRegMSE(labels, predicted);
  const { r2 } = evalRegR2(labels, predicted);
  return { mse, r2 };
};
