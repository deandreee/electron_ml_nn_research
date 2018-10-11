import { NumberMap } from "./mlUtils";
import { padEnd, sum } from "lodash";
import { round2 } from "./utils";

// * Precision/Specificity: how many selected instances are relevant.
// * Recall/Sensitivity: how many relevant instances are selected.
// * F1 score: harmonic mean of precision and recall.

export const evaluateResults = (uniqueLabels: number[], input: number[], output: number[]) => {
  let truePositives: NumberMap = {};
  let falsePositives: NumberMap = {};
  let falseNegatives: NumberMap = {};

  for (let x of uniqueLabels) {
    truePositives[x] = 0;
    falsePositives[x] = 0;
    falseNegatives[x] = 0;
  }

  for (let i = 0; i < input.length; i++) {
    const label = input[i];

    if (input[i] === output[i]) {
      truePositives[label]++;
    } else {
      falsePositives[output[i]]++; // is, but but have not been
      falseNegatives[input[i]]++; // should have been, but is not
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

  console.log(padEnd("PRECISION_TOTAL", 20), round2(precisionTotal));
  console.log(padEnd("RECALL_TOTAL", 20), round2(recallTotal));
  console.log(padEnd("F_SCORE", 20), round2(fScore));

  return { fScore, precision, precisionTotal, recall, recallTotal };
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

export const evaluateResultsInXs = (limit: number, input: number[], output: number[]) => {
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
