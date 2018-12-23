import * as tf from "@tensorflow/tfjs";

export const createModel4_KerasStacked = (batchSize: number, featureCount: number, labelCount: number) => {
  const model = tf.sequential();

  // model.add(tf.layers.embedding({ inputDim: featureCount, outputDim: 256, inputShape: [BATCH_SIZE, featureCount] }));

  model.add(
    tf.layers.lstm({
      units: 32,
      inputShape: [batchSize, featureCount],
      returnSequences: true
    })
  );

  model.add(
    tf.layers.lstm({
      units: 32,
      returnSequences: true
    })
  );

  model.add(
    tf.layers.lstm({
      units: 32,
      returnSequences: false
    })
  );

  model.add(tf.layers.dense({ units: labelCount, activation: "softmax" }));

  model.compile({ loss: "categoricalCrossentropy", optimizer: "rmsprop", metrics: ["accuracy"] });

  return model;
};
