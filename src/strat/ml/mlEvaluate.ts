import { NumberMap } from "./mlUtils";
import { padEnd, sum } from "lodash";
import { avg, round2 } from "../utils";
import * as regression from "regression";
import { Series } from "pandas-js";

// * Precision/Specificity: how many selected instances are relevant.
// * Recall/Sensitivity: how many relevant instances are selected.
// * F1 score: harmonic mean of precision and recall.

export const evaluateResults = (uniqueLabels: number[], input: number[], output: number[]) => {
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

  for (let i = 0; i < input.length; i++) {
    const label = input[i];

    if (input[i] === output[i]) {
      truePositives[label]++;
      hitCount++;
    } else {
      falsePositives[output[i]]++; // is, but but have not been
      falseNegatives[input[i]]++; // should have been, but is not
    }

    if (input[i] === 0 && output[i] === 2) {
      bigErrorsCount++;
    } else if (input[i] === 2 && output[i] === 0) {
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
  const hitRate = hitCount / input.length;
  const bigErrorsReverse = 1 - bigErrorsCount / input.length;

  // console.log(padEnd("PRECISION_TOTAL", 20), round2(precisionTotal));
  // console.log(padEnd("RECALL_TOTAL", 20), round2(recallTotal));
  // console.log(padEnd("F_SCORE", 20), round2(fScore));

  return { fScore, precision, precisionTotal, recall, recallTotal, hitRate, bigErrorsReverse };
};

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

export const evaluateResultsInXs = (limit: number, input: number[], output: number[]): MlEvaluateResults => {
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
    const err = lbl - pred;

    errSum += err * err;
  }

  return errSum;
};

// SST is the sum of squared errors of our baseline model.
export const calcSST = (labels: number[]) => {
  const mean = avg(labels, x => x);
  let errSum = 0;
  for (let i = 0; i < labels.length; i++) {
    const lbl = labels[i];
    const err = lbl - mean;
    errSum += err * err;
  }

  return errSum;
};

export const evalRegMSE = (labels: number[], predicted: number[]) => {
  if (labels.length !== predicted.length) {
    throw new Error("evalRegMSE: lengths not equal");
  }

  const errSum = calcSSE(labels, predicted);
  const mse = errSum / labels.length;

  // console.log(padEnd("MSE", 10), round2(mse));

  return { mse };
};

export const evalRegR2 = (labels: number[], predicted: number[]) => {
  if (labels.length !== predicted.length) {
    throw new Error("evalRegMSE: lengths not equal");
  }

  const sse = calcSSE(labels, predicted);
  const sst = calcSST(labels);
  const r2 = 1 - sse / sst;

  // console.log(padEnd("R2", 10), round2(r2));

  return { r2 };
};

export const evalRegCorr = (labels: number[], predicted: number[]) => {
  const linreg = regression.linear(labels.map((w, i) => [labels[i], predicted[i]]));
  const r2 = linreg.r2;

  const s1 = new Series(labels);
  const s2 = new Series(predicted);
  const corr = round2(s1.corr(s2));

  // console.log(padEnd("CORR/LR", 10), round2(corr));
  // console.log(padEnd("R2/LR", 10), round2(r2));

  return { r2, corr };
};
