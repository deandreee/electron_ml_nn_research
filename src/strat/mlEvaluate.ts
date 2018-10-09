import { NumberMap } from "./mlUtils";

export const evaluateResults = (labelNames: number[], input: number[], output: number[]) => {
  let truePositives: NumberMap = {};
  let falsePositives: NumberMap = {};

  for (let x of labelNames) {
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
  for (let x of labelNames) {
    precision[x] = truePositives[x] / (truePositives[x] + falsePositives[x]);
  }

  console.log("preision", precision);

  return precision;
};
