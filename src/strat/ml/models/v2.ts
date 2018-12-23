import * as tf from "@tensorflow/tfjs";

export const createModel2 = (batchSize: number, featureCount: number, labelCount: number) => {
  const model = tf.sequential();

  const hidden = tf.layers.lstm({
    units: 16,
    // dropout: 0.2,
    // recurrentDropout: 0.2,
    activation: "sigmoid",
    inputShape: [batchSize, featureCount],
    // kernelInitializer: "randomNormal",
    // biasInitializer: "zeros",
    returnSequences: true
  });
  model.add(hidden);

  // model.add(tf.layers.dense({ units: uniqueLabels.length, activation: "relu" }));
  // model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: labelCount, activation: "softmax" }));

  // const dense = tf.layers.dense({ units: 1, activation: "softmax" });
  // model.add(tf.layers.timeDistributed({ layer: dense }));

  // model.compile({ loss: "meanSquaredError", optimizer: "sgd" });
  model.compile({ loss: tf.losses.softmaxCrossEntropy, optimizer: "rmsprop", metrics: ["accuracy"] });

  return model;
};
