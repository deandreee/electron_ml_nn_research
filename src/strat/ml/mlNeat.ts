import * as neataptic from "neataptic";
import * as synaptic from "synaptic";
import * as brain from "brain.js";
import * as mlUtils from "./mlUtils";
import * as mlEvaluate from "./mlEvaluate";
import { Candle } from "../types";
import { CorrCandles } from "../corr/CorrCandles";
import { round2 } from "../utils";
import { FnGetFeature } from "../features";

export const predictNeataptic = async (corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  let features = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  features.forEach(mlUtils.sanityCheckRow);
  let labels = corrCandles.candlesActual.map(x => x.pctChange._240m);

  features = mlUtils.rescaleFeatures(features);
  labels = labels.map(x => round2(x));

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

  const predicted = features.map(x => net.activate(x) as number);
  mlEvaluate.evalRegMSE(labels, predicted);

  return { labels, predicted };
};

export const predictSynaptic = (candlesActual: Candle[]) => {
  let features = candlesActual.map(x => [x.ind.macd.x60.sig9.histo, x.ind.macd.x120.sig9.histo, x.ind.rsi.x60.p10]);
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
