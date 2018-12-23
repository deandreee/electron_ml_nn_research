import * as tf from "@tensorflow/tfjs";

// https://keras.io/getting-started/sequential-model-guide/
export const createModel3_Keras = (batchSize: number, featureCount: number) => {
  const model = tf.sequential();

  model.add(tf.layers.embedding({ inputDim: featureCount, outputDim: 256, inputShape: [batchSize, featureCount] }));

  model.add(
    tf.layers.lstm({
      units: 16,
      activation: "sigmoid",
      inputShape: [batchSize, featureCount]
      // returnSequences: true
    })
  );

  model.add(tf.layers.dropout({ rate: 0.5 }));

  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

  // const loss = tf.losses.softmaxCrossEntropy;
  // const loss = "categorical_crossentropy";
  const loss = "categoricalCrossentropy";
  model.compile({ loss, optimizer: "rmsprop", metrics: ["accuracy"] });

  return model;
};
