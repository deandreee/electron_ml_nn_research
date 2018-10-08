import { round1 } from "./utils";
import { rescale } from "./rescale";

export const logLabelsPlusMinus5 = (labels: number[]) => {
  for (let i = -5; i <= 5; i++) {
    const count = labels.filter(x => x === i).length;
    console.log(`label \t ${i} \t ${count}`);
  }
};

export const logFeaturesPlusMinus1 = (features: number[][]) => {
  const fCount = features[0].length;
  for (let fc = 0; fc < fCount; fc++) {
    console.log(`      ---------- FEATURE: ${fc} ----------       `);
    logRowPlusMinus1(features.map(x => x[fc]));
  }
};

export const logLabelsPlusMinus1 = (labels: number[]) => {
  console.log(`      ---------- LABELS ----------       `);
  logRowPlusMinus1(labels);
};

export const logRowPlusMinus1 = (row: number[]) => {
  for (let i = -1; i <= 1; i += 0.1) {
    const iRounded = round1(i);
    const count = row.filter(x => round1(x) === iRounded).length;
    console.log(`label \t ${iRounded} \t ${count}`);
  }
};

export const rescaleFeatures = (features: number[][]) => {
  const fCount = features[0].length; // small count like 5
  for (let fc = 0; fc < fCount; fc++) {
    // big length like 50k
    const min = Math.min(...features.map(x => x[fc]));
    const max = Math.max(...features.map(x => x[fc]));
    for (let row of features) {
      row![fc] = rescale(row![fc], min, max);
    }
  }
  return features;
};

// const rescaleRowRoundNumbers = (labels: number[]) => {
//   return labels.map(x => Math.round(x));
// };

export const rescaleRow = (labels: number[]) => {
  const min = Math.min(...labels);
  const max = Math.max(...labels);
  const res = labels.map(x => rescale(x, min, max));

  checkNaN(res);

  return res;
};

export const checkNaN = (row: number[]) => {
  for (let x of row) {
    if (isNaN(x)) {
      throw new Error("NaN found!");
    }
  }
};
