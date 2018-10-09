import { NumberMap } from "./mlUtils";
import { sum } from "lodash";

export const evaluateResults = (uniqueLabels: number[], input: number[], output: number[]) => {
  let truePositives: NumberMap = {};
  let falsePositives: NumberMap = {};

  for (let x of uniqueLabels) {
    truePositives[x] = 0;
    falsePositives[x] = 0;
  }

  for (let i = 0; i < input.length; i++) {
    const label = input[i];

    if (input[i] === output[i]) {
      truePositives[label]++;
    } else {
      falsePositives[output[i]]++;
    }
  }

  let precision: NumberMap = {};
  for (let x of uniqueLabels) {
    const px = truePositives[x] / (truePositives[x] + falsePositives[x]);
    precision[x] = !isNaN(px) ? px : 0;
  }

  console.log("preision", precision);

  const precisionTotal = sum(objToArr(precision)) / uniqueLabels.length;

  console.log("PRECISION_TOTAL", precisionTotal);

  return { precision, precisionTotal };
};

const objToArr = (o: any) => {
  return Object.keys(o).map(x => o[x]);
};
