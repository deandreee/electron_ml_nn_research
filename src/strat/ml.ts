import { Candle } from "./types";
import * as libsvm from "libsvm-js";
import * as brain from "brain.js";
import * as neataptic from "neataptic";
import * as synaptic from "synaptic";
import * as mlUtils from "./mlUtils";
import * as mlEvaluate from "./mlEvaluate";
import { getFeatures } from "./getFeatures";
import { CorrCandles } from "./corrCalc";

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
    type: SVM.SVM_TYPES.C_SVC
    // type: SVM.SVM_TYPES.EPSILON_SVR // regression if continuous range of numbers
    // type: SVM.SVM_TYPES.NU_SVR // regression if continuous range of numbers
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

export const predictSvm = async (corrCandles: CorrCandles) => {
  try {
    await predictSvm_(corrCandles);
  } catch (err) {
    console.error(err.stack);
  }
};

const predictSvm_ = async (corrCandles: CorrCandles) => {
  const svm = await createRBFSVM();

  let features = getFeatures(corrCandles);
  let labels = corrCandles.candlesActual.map(x => x.pctChange._240m);

  features = mlUtils.rescaleFeatures(features);
  // labels = mlUtils.rescaleRow(labels);
  labels = mlUtils.rescaleRowRoundNumbers(labels);
  const uniqueLabels = mlUtils.getUniqueLabels(labels);

  mlUtils.logFeaturesPlusMinus1(features);
  mlUtils.logLabels(uniqueLabels, labels);

  const labelCount = mlUtils.countLabels(uniqueLabels, labels);
  console.log("labelCount", labelCount);

  let testData = features.map((x, i) => ({ features: x, label: labels[i] }));
  // testData = mlUtils.oversample(testData, labelCount);
  // testData = mlUtils.undersample(testData, labelCount, 200);
  testData = mlUtils.middlesample(testData, labelCount, 500);

  features = testData.map(x => x.features);
  labels = testData.map(x => x.label);

  mlUtils.logLabels(uniqueLabels, labels);

  // svm.train(features, labels, { C: 1 });
  svm.train(features, labels);
  const predicted = svm.predict(features) as number[];
  mlUtils.logLabels(uniqueLabels, predicted);

  mlEvaluate.evaluateResults(uniqueLabels, labels, predicted);

  // const crossVal = svm.crossValidation(features, labels, 3);
  // console.log(crossVal);

  // const p1 = svm.predictOneProbability(features[0]);
  // console.log("p1", labels[0], p1, p1.estimates[0], p1.estimates[1], p1.estimates[2]);
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

export const predictNeataptic = (candlesActual: Candle[]) => {
  let features = candlesActual.map(x => [x.ind.macd60.histo, x.ind.macd120.histo, x.ind.rsi60x10]);
  let labels = candlesActual.map(x => x.pctChange._240m);

  features = mlUtils.rescaleFeatures(features);
  labels = mlUtils.rescaleRow(labels);

  mlUtils.logLabelsPlusMinus1(labels);

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
  mlUtils.logLabelsPlusMinus1(output);
};

export const predictSynaptic = (candlesActual: Candle[]) => {
  let features = candlesActual.map(x => [x.ind.macd60.histo, x.ind.macd120.histo, x.ind.rsi60x10]);
  let labels = candlesActual.map(x => x.pctChange._240m);

  features = mlUtils.rescaleFeatures(features);
  labels = mlUtils.rescaleRow(labels);

  mlUtils.logLabelsPlusMinus1(labels);

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
  mlUtils.logLabelsPlusMinus1(output);
};
