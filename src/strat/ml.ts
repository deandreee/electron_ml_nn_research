import { Candle } from "./types";
import * as libsvm from "libsvm-js";
import { rescale } from "./rescale";
import * as brain from "brain.js";
import * as neataptic from "neataptic";
import * as synaptic from "synaptic";
import { round1 } from "./utils";
// import { getTrainData } from "./getTrainData";

// https://github.com/mljs/libsvm

// -s svm_type : set type of SVM (default 0)
// 	0 -- C-SVC		(multi-class classification)
// 	1 -- nu-SVC		(multi-class classification)
// 	2 -- one-class SVM
// 	3 -- epsilon-SVR	(regression)
// 	4 -- nu-SVR		(regression)

const createRBFSVM = async () => {
  const SVM = await libsvm;

  return new SVM({
    kernel: SVM.KERNEL_TYPES.RBF,
    // kernel: SVM.KERNEL_TYPES.LINEAR,
    // type: SVM.SVM_TYPES.C_SVC
    type: SVM.SVM_TYPES.EPSILON_SVR // regression if continuous range of numbers
    // gamma: 1, // Default value is 1/num_features
    // cost: 1, // Cost parameter, for C SVC, Epsilon SVR and NU SVR, default 1
    // weight: {
    //   1: 50,
    //   0: 1
    // }
    // [options.shrinking]	boolean	true	Use shrinking euristics (faster),
    // shrinking: false
  });
};

// const createLinearSVM = () => {
//   return new SVM({
//     kernel: SVM.KERNEL_TYPES.LINEAR,
//     type: SVM.SVM_TYPES.NU_SVR
//   });
// };

export const predictSvm = async (candlesActual: Candle[]) => {
  const svm = await createRBFSVM();

  // x.ind.bbands.upppredicteder - x.ind.bbands.lower,
  // x.ind.macd60.histo,

  let features = candlesActual.map(x => [x.ind.macd60.histo, x.ind.macd120.histo, x.ind.rsi]);
  // let features = candlesActual.map(x => [x.ind.ifts30x15, x.ind.ifts60x15]);
  let labels = candlesActual.map(x => x.pctChange._240m);

  features = rescaleFeatures(features);
  labels = rescaleRow(labels);
  // labels = rescaleRowRoundNumbers(labels);

  logFeaturesPlusMinus1(features);
  logLabelsPlusMinus1(labels);

  // svm.train(features, labels, { C: 1 });
  svm.train(features, labels);
  const predicted = svm.predict(features) as number[];
  logLabelsPlusMinus1(predicted);

  // const crossVal = svm.crossValidation(features, labels);
  // console.log(crossVal);

  const p1 = svm.predictOneProbability(features[0]);
  console.log("p1", labels[0], p1, p1.estimates[0], p1.estimates[1], p1.estimates[2]);
};

// const logLabelsPlusMinus5 = (labels: number[]) => {
//   for (let i = -5; i <= 5; i++) {
//     const count = labels.filter(x => x === i).length;
//     console.log(`label \t ${i} \t ${count}`);
//   }
// };

const logFeaturesPlusMinus1 = (features: number[][]) => {
  const fCount = features[0].length;
  for (let fc = 0; fc < fCount; fc++) {
    console.log(`      ---------- FEATURE: ${fc} ----------       `);
    logRowPlusMinus1(features.map(x => x[fc]));
  }
};

const logLabelsPlusMinus1 = (labels: number[]) => {
  console.log(`      ---------- LABELS ----------       `);
  logRowPlusMinus1(labels);
};

const logRowPlusMinus1 = (row: number[]) => {
  for (let i = -1; i <= 1; i += 0.1) {
    const iRounded = round1(i);
    const count = row.filter(x => round1(x) === iRounded).length;
    console.log(`label \t ${iRounded} \t ${count}`);
  }
};

export const predictBrain = (candlesActual: Candle[]): number[] => {
  const features = candlesActual.map(x => x.features);
  const labels = candlesActual.map(x => x.label);

  const net = new brain.recurrent.LSTM();

  features.map((x, i) => {
    console.log("train", i);
    let data = { input: x, output: [labels[i]] };
    net.train([data]);
  });

  const output = features.map(x => {
    const res = net.run(x) as number;
    return res;
  });

  return output;
};

const rescaleFeatures = (features: number[][]) => {
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

const rescaleRow = (labels: number[]) => {
  const min = Math.min(...labels);
  const max = Math.max(...labels);
  const res = labels.map(x => rescale(x, min, max));

  checkNaN(res);

  return res;
};

const checkNaN = (row: number[]) => {
  for (let x of row) {
    if (isNaN(x)) {
      throw new Error("NaN found!");
    }
  }
};

export const predictNeataptic = (candlesActual: Candle[]): number[] => {
  // let features = candlesActual.map(x => [x.ind.ifts30x15, x.ind.ifts60x15, x.ind.macd60.histo, x.ind.macd120.histo]);
  let features = candlesActual.map(x => [x.ind.ifts30x15, x.ind.ifts60x15]);
  let labels = candlesActual.map(x => x.pctChange._480m);

  features = rescaleFeatures(features);
  labels = rescaleRow(labels);

  logLabelsPlusMinus1(labels);

  const len = features[0].length;
  const net = new neataptic.architect.LSTM(len, len * 2, 1);

  let data = features.map((x, i) => ({
    input: x,
    output: [labels[i]]
  }));

  net.train(data, {
    log: 1, // 500,
    iterations: 100,
    error: 0.5,
    clear: true,
    rate: 0.05,
    shuffle: true // !!!
  });

  const output = features.map(x => net.activate(x) as number);
  logLabelsPlusMinus1(output);

  return output.map(x => (x > 0.1 ? 1 : x));
};

export const predictSynaptic = (candlesActual: Candle[]): number[] => {
  const features = candlesActual.map(x => x.features);
  const labels = candlesActual.map(x => x.label);

  // min max for each feature, then re-calc
  const fCount = features[0]!.length;
  for (let f = 0; f < fCount; f++) {
    const min = Math.min(...features.map(x => x![f]));
    const max = Math.max(...features.map(x => x![f]));
    for (let row of features) {
      row![f] = rescale(row![f], min, max);
    }
  }

  const Architect = synaptic.Architect;
  const Layer = synaptic.Layer;
  const Trainer = synaptic.Trainer;

  const lstmOptions = {
    peepholes: Layer.connectionType.ALL_TO_ALL,
    hiddenToHidden: false,
    outputToHidden: false,
    outputToGates: false,
    inputToOutput: true
  };
  const lstm = new Architect.LSTM(1, 4, 4, 4, 1, lstmOptions);
  const trainer = new Trainer(lstm);

  const trainOptions = {
    rate: 0.2,
    iterations: 10000,
    error: 0.005
  };

  let trainData = features.map((x, i) => ({ input: x, output: [labels[i]] }));
  trainer.train(trainData, trainOptions);

  const output = features.map(x => lstm.activate(x) as number);
  return output.map(x => (x > 0.01 ? 1 : x));
};
