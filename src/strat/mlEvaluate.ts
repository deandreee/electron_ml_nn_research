import { NumberMap } from "./mlUtils";
import { sum } from "lodash";

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

  console.log("preision", precision);

  const precisionTotal = sum(objToArr(precision)) / uniqueLabels.length;
  const recallTotal = sum(objToArr(recall)) / uniqueLabels.length;
  const fScore = (2 * precisionTotal * recallTotal) / (precisionTotal + recallTotal);

  console.log("PRECISION_TOTAL", precisionTotal);
  console.log("RECALL_TOTAL", recallTotal);
  console.log("F_SCORE", fScore);

  return { fScore, precision, precisionTotal, recall, recallTotal };
};

const objToArr = (o: any) => {
  return Object.keys(o).map(x => o[x]);
};
