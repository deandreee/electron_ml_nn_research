import * as libsvm from "libsvm-js";
import * as mlUtils from "./mlUtils";
import * as mlEvaluate from "./mlEvaluate";
import { FnGetFeature } from "./mlGetFeatures";
import { CorrCandles } from "../corr/CorrCandles";
import { round2 } from "../utils";
// import * as csvLog from "./csvLog";

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
    type: SVM.SVM_TYPES.C_SVC,
    // Default value is 1/num_features
    // if we go with single feature, then it's 1
    gamma: 10,
    cost: 5000,
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
    quiet: true
  });
};

// const createLinearSVM = () => {
//   return new SVM({
//     kernel: SVM.KERNEL_TYPES.LINEAR,
//     type: SVM.SVM_TYPES.NU_SVR
//   });
// };

export const predictSvm = async (corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  try {
    return await predictSvm_(corrCandles, fnGetFeature);
  } catch (err) {
    console.error(err.stack);
    throw new Error(err);
  }
};

const getLabels = (corrCandles: CorrCandles) => {
  return corrCandles.candlesActual.map(x => x.pctChange._1d);
};

const predictSvm_ = async (corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  const svm = await createRBFSVM();

  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);

  let labels = getLabels(corrCandles);

  features = mlUtils.rescaleFeatures(features);
  // labels = mlUtils.rescaleRow(labels);
  labels = mlUtils.rescaleRowRoundNumbers(labels);
  const uniqueLabels = mlUtils.getUniqueLabels(labels);

  // mlUtils.logFeaturesPlusMinus1(features);
  // mlUtils.logLabels(uniqueLabels, labels);

  const labelCount = mlUtils.countLabels(uniqueLabels, labels);

  let testData = features.map((x, i) => ({ features: x, label: labels[i] }));
  // testData = mlUtils.oversample(testData, labelCount);
  // testData = mlUtils.undersample(testData, labelCount, 200);
  testData = mlUtils.middlesample(testData, labelCount, 500);

  const featuresMiddlesampled = testData.map(x => x.features);
  const labelsMiddlesampled = testData.map(x => x.label);

  // sanity check here that all 500
  // mlUtils.logLabels(uniqueLabels, labelsMiddlesampled);

  // TRAIN WITH MIDDLE, PREDICT WITH ORIGINAL !!!
  svm.train(featuresMiddlesampled, labelsMiddlesampled);
  const predicted = svm.predict(features) as number[];
  // mlUtils.logLabels(uniqueLabels, predicted);

  const results = mlEvaluate.evaluateResults(uniqueLabels, labels, predicted);
  const results3s = mlEvaluate.evaluateResultsInXs(3, labels, predicted);
  const results5s = mlEvaluate.evaluateResultsInXs(5, labels, predicted);

  // const crossVal = svm.crossValidation(features, labels, 3);
  // console.log(crossVal);

  // const p1 = svm.predictOneProbability(features[0]);
  // console.log("p1", labels[0], p1, p1.estimates[0], p1.estimates[1], p1.estimates[2]);

  return { svm, results, results3s, results5s };
};

export const predictSvmRegression = async (corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  const SVM = await libsvm;

  const gamma = 3;
  const cost = 3;

  const svm = new SVM({
    kernel: SVM.KERNEL_TYPES.RBF,
    type: SVM.SVM_TYPES.EPSILON_SVR,
    gamma,
    cost,
    quiet: true
  });

  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  // await csvLog.appendVertical("output/features.csv", features.map(x => x[0]));

  let labels = getLabels(corrCandles);

  features = mlUtils.rescaleFeatures(features);
  // await csvLog.appendVertical("output/features_scaled.csv", features.map(x => x[0]));
  labels = labels.map(x => round2(x));

  svm.train(features, labels);
  const predicted = svm.predict(features) as number[];

  const { mse } = mlEvaluate.evalRegMSE(labels, predicted);
  const { r2 } = mlEvaluate.evalRegR2(labels, predicted);
  mlEvaluate.evalRegCorr(labels, predicted);

  return { svm, labels, predicted, mse, gamma, cost, r2 };
};

export const predictAnotherMonth = (svm: any, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  try {
    return predictAnotherMonthReg(svm, corrCandles, fnGetFeature);
  } catch (err) {
    console.error(err.stack);
    throw new Error(err);
  }
};

// not sure if we will need classes anymore
// export const predictAnotherMonthClass = (svm: any, corrCandles: CorrCandles) => {
//   let features = getFeatures(corrCandles);
//   let labels = getLabels(corrCandles);
//   features = mlUtils.rescaleFeatures(features);
//   labels = mlUtils.rescaleRowRoundNumbers(labels);
//   const uniqueLabels = mlUtils.getUniqueLabels(labels);

//   const predicted = svm.predict(features) as number[];
//   mlUtils.logLabels(uniqueLabels, predicted);

//   mlEvaluate.evaluateResults(uniqueLabels, labels, predicted);
//   mlEvaluate.evaluateResultsInXs(3, labels, predicted);
//   mlEvaluate.evaluateResultsInXs(5, labels, predicted);
// };

export const predictAnotherMonthReg = (svm: any, corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);

  let labels = getLabels(corrCandles);

  features = mlUtils.rescaleFeatures(features);
  labels = labels.map(x => round2(x));

  // DO NOT RE-TRAIN HERE!!!
  const predicted = svm.predict(features) as number[];

  const { mse } = mlEvaluate.evalRegMSE(labels, predicted);
  const { r2 } = mlEvaluate.evalRegR2(labels, predicted);
  mlEvaluate.evalRegCorr(labels, predicted);

  return { svm, labels, predicted, mse, gamma: svm.options.gamma, cost: svm.options.cost, r2 };
};
