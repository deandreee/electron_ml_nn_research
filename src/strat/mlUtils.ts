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

export const rescaleRowRoundNumbers = (labels: number[]) => {
  return labels.map(x => Math.round(x));
};

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

interface TestData {
  features: number[];
  label: number;
}

export interface LabelCount {
  [label: number]: number;
}

export const countLabels = (labels: number[], start: number, end: number, increment: number) => {
  const labelCount: LabelCount = {};

  for (let i = start; i <= end; i += increment) {
    const count = countByLabel(labels, i);
    // if (count > 0) {
    labelCount[i] = count;
    // }
  }

  return labelCount;
};

export const countByLabel = (labels: number[], label: number) => {
  let res = 0;
  for (let x of labels) {
    if (x === label) {
      res++;
    }
  }
  return res;
};

interface TestData {
  features: number[];
  label: number;
}

export const undersample = (testData: TestData[], labelCount: LabelCount, max: number) => {
  let res: TestData[] = [];
  try {
    for (let label in labelCount) {
      if (labelCount[label] >= max) {
        const reSamples = take(testData, Number(label), max);
        res = res.concat(reSamples);
      }
    }
  } catch (err) {
    console.log(err);
  }

  return res;
};

export const take = (testData: TestData[], label: number, count: number) => {
  let res: TestData[] = [];
  for (let x of testData) {
    if (x.label === label) {
      res.push(x);
      if (res.length === count) {
        return res;
      }
    }
  }

  throw new Error(`Not enough items found for label ${label}`);
};

export const oversample = (testData: TestData[], labelCount: LabelCount) => {
  const max = Math.max(...Object.keys(labelCount).map(key => labelCount[Number(key)]));

  for (let label in labelCount) {
    if (labelCount[label] < max) {
      const reSamples = duplicateClass(testData, Number(label), max - labelCount[label]);
      console.log("reSamples", label, reSamples.length);

      testData = testData.concat(reSamples);
    }
  }

  return testData;
};

export const duplicateClass = (testData: TestData[], label: number, diff: number) => {
  const existing = testData.filter(x => x.label === label);
  const reSamples: TestData[] = [];

  if (existing.length === 0) {
    return reSamples;
  }

  for (let i = 0; i < diff; i++) {
    const x = existing[i % existing.length];

    if (!x) {
      throw new Error("existing null");
    }

    reSamples.push(x);
  }
  return reSamples;
};
