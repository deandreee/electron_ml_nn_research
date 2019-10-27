// ask: disabled for now to not show error msg in console each time
// const tf = require("@tensorflow/tfjs");
// require("@tensorflow/tfjs-node"); // just add the binding

var Indicator = function(period, type) {
  this.period = period;

  this.result = null;
  this.history = [];
  this.m = tf.variable(tf.scalar(Math.random())); // slope
  this.b = tf.variable(tf.scalar(Math.random())); // y intercept

  // for poly
  this.a = tf.variable(tf.scalar(Math.random())); // y intercept
  this.c = tf.variable(tf.scalar(Math.random())); // y intercept
  this.d = tf.variable(tf.scalar(Math.random())); // y intercept

  this.predict = type === "linear" ? this.predictLin : this.predictPoly;
};

Indicator.prototype.predictPoly = function(x) {
  // y = a * x ^ 3 + b * x ^ 2 + c * x + d
  return tf.tidy(() => {
    return this.a
      .mul(x.pow(tf.scalar(3, "int32")))
      .add(this.b.mul(x.square()))
      .add(this.c.mul(x))
      .add(this.d);

    // ask: linear
    // return x.mul(a).add(b);
  });
};

Indicator.prototype.predictLin = function(x) {
  // y = mx + b
  const yPred = x.mul(this.m).add(this.b);
  return yPred;
};

Indicator.prototype.loss = function(predictions, labels) {
  // Subtract our labels (actual values) from predictions, square the results,
  // and take the mean.
  const meanSquareError = predictions
    .sub(labels)
    .square()
    .mean();

  //   console.log("meanSquareError", meanSquareError.dataSync());
  return meanSquareError;
};

Indicator.prototype.train = function(xs, ys, numIterations = 5) {
  const learningRate = 0.5;
  const optimizer = tf.train.sgd(learningRate);

  for (let iter = 0; iter < numIterations; iter++) {
    optimizer.minimize(() => {
      const predsYs = this.predict(xs);
      return this.loss(predsYs, ys);
    });
  }
};

Indicator.prototype.deNormalize = function(x, max, min) {
  return (
    x.dataSync()[0] * (max.dataSync()[0] - min.dataSync()[0]) +
    min.dataSync()[0]
  );
};

Indicator.prototype.update = function(candle) {
  this.history.push(candle);

  if (this.history.length < this.period) {
    return null;
  }

  this.history.shift(); // remove first, keep it at length === period

  const features = this.history.map((x, i) => i);
  const labels = this.history.map(x => x.close);
  const xs = tf.tensor(features);
  const ys = tf.tensor(labels);

  // Normalize the y values to the range 0 to 1.
  const ymin = ys.min();
  const ymax = ys.max();
  const yrange = ymax.sub(ymin);
  const ysNormalized = ys.sub(ymin).div(yrange);

  const xmin = xs.min();
  const xmax = xs.max();
  const xrange = xmax.sub(xmin);
  const xsNormalized = xs.sub(xmin).div(xrange);

  this.train(xsNormalized, ysNormalized);

  const prediction = this.predict(tf.tensor(1)); // like the last one
  return this.deNormalize(prediction, ymax, ymin);
};

module.exports = Indicator;
