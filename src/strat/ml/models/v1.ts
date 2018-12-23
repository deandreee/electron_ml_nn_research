import * as tf from "@tensorflow/tfjs";

export const createModel = (batchSize: number, featureCount: number) => {
  const model = tf.sequential();

  const hidden = tf.layers.lstm({
    units: 16,
    activation: "sigmoid",

    // input_shape is supposed to be (timesteps, n_features). Remove the first dimension.
    // input_shape = (95000,360)
    // inputShape: [100, featureCount],
    inputShape: [batchSize, featureCount],
    kernelInitializer: "randomNormal",
    biasInitializer: "zeros",
    // inputShape: [featureCount, 1],
    // inputShape: [featureCount],
    // returnSequences: true
    returnSequences: false
  });
  model.add(hidden);

  // output layer
  // const output = tf.layers.lstm({
  //   units: 1,
  //   activation: "softmax",
  //   // hmm maybe this for flat output ?
  //   returnSequences: false
  //   // returnSequences: true
  // });
  // model.add(output);

  // const apool = tf.layers.averagePooling1d({});
  // model.add(apool);

  // const flatten = tf.layers.flatten();
  // model.add(flatten);

  // usually eveywhere output type is dense, let's try
  // const output = tf.layers.dense({ units: 1, activation: "sigmoid" });
  const output = tf.layers.dense({ units: 1, activation: "softmax" });
  model.add(output);

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

  return model;
};
