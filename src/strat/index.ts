import { Candle, CoinList } from "./types";
import { vol1 } from "./vol1";
import * as ms from "ms";
import { queryCoins } from "./queryCoins";
import * as pumps from "./pumps";
import * as SVM from "libsvm-js/asm";
import { rescale } from "./rescale";
import * as brain from "brain.js";
import * as neataptic from "neataptic";
import * as synaptic from "synaptic";
import { getTrainData } from "./getTrainData";

const from = new Date("2018-08-10T00:00:00.000Z");
const to = new Date("2018-08-22T00:00:00.000Z");

// const { from, to } = pumps.jun2;

const fromExtended = new Date(from.getTime() - ms(`${15 * 30}m`)); // because XmRsi
const toExtended = new Date(to.getTime() + ms("1h"));

interface Result {
  coins: CoinList;
  labelsPredicted: number[];
}

export const run = (): Result => {
  const coins = queryCoins(fromExtended, toExtended);
  vol1(coins);

  const candlesActual = coins.BTC.candles.filter(
    x => x.start * 1000 >= from.getTime() && x.start * 1000 <= to.getTime()
  );

  const labelsPredicted = predictNeataptic(candlesActual);

  return { coins, labelsPredicted };
};

const predictSvm = (candlesActual: Candle[]): number[] => {
  const svm = new SVM({
    kernel: SVM.KERNEL_TYPES.RBF, // The type of kernel I want to use
    type: SVM.SVM_TYPES.C_SVC, // The type of SVM I want to run
    gamma: 1, // RBF kernel gamma parameter
    cost: 1, // C_SVC cost parameter
    weight: {
      1: 5,
      0: 1
    }
  });

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

  svm.train(features, labels, { C: 1 });
  const predicted = svm.predict(features) as number[];

  console.log("train 1", labels.filter(x => x === 1).length);
  console.log("train 0", labels.filter(x => x === 0).length);
  console.log("lbl 1", predicted.filter(x => x === 1).length);
  console.log("lbl 0", predicted.filter(x => x === 0).length);

  return predicted;
};

const predictBrain = (candlesActual: Candle[]): number[] => {
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

const predictNeataptic = (candlesActual: Candle[]): number[] => {
  const { testFeatures, testLabels } = getTrainData(candlesActual);

  const len = testFeatures[0].length;
  const net = new neataptic.architect.LSTM(len, len, 1);

  let data = testFeatures.map((x, i) => ({
    input: x,
    output: [testLabels[i]]
  }));

  net.train(data, {
    log: 500,
    iterations: 6000,
    error: 0.5,
    clear: true,
    rate: 0.05,
    shuffle: true // !!!
  });

  const features = candlesActual.map(x => x.features);
  const output = features.map(x => net.activate(x) as number);
  return output.map(x => (x > 0.1 ? 1 : x));
};

const predictSynaptic = (candlesActual: Candle[]): number[] => {
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

  const len = features[0].length;

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
  const trainResults = trainer.train(trainData, trainOptions);

  const output = features.map(x => lstm.activate(x) as number);
  return output.map(x => (x > 0.01 ? 1 : x));
};
