// from here: https://gist.github.com/scragz/fffa72d6deebd6cb171340f6581192f7
var convnetjs = require("convnetjs");
var math = require("mathjs");

// [neuralnet]
// price_buffer_len = 100
// learning_rate = 0.01
// scale = 1
// momentum = 0.1
// decay = 0.1
// min_predictions = 1000
//
// this.addIndicator('neuralnet', 'NN', this.settings.neuralnet);
// this.indicators.neuralnet.result.meanAlpha && this.indicators.neuralnet.result.meanAlpha < -1 // sell
// this.indicators.neuralnet.result.meanAlpha && this.indicators.neuralnet.result.meanAlpha > 1 // buy

var Indicator = function(config) {
  this.input = "candle";
  this.candle = null;
  this.priceBuffer = [];
  this.predictionCount = 0;
  this.neurons = 0;
  this.batchsize = 5;
  this.layer_activation = "tanh";
  this.settings = config;
  this.result = {
    prediction: null,
    meanp: null,
    meanAlpha: null,
  };

  let layers = [
    { type: "input", out_sx: 1, out_sy: 1, out_depth: 1 },
    { type: "fc", num_neurons: this.neurons, activation: this.activation },
    { type: "regression", num_neurons: 1 },
  ];

  this.nn = new convnetjs.Net();

  this.nn.makeLayers(layers);
  this.trainer = new convnetjs.SGDTrainer(this.nn, {
    learning_rate: config.learning_rate,
    momentum: config.momentum,
    batch_size: this.batchsize,
    l2_decay: config.decay,
  });
};

Indicator.prototype.learn = function() {
  for (let i = 0; i < this.priceBuffer.length - 1; i++) {
    let data = [this.priceBuffer[i]];
    let current_price = [this.priceBuffer[i + 1]];
    let vol = new convnetjs.Vol(data);
    this.trainer.train(vol, current_price);
    let predicted_values = this.nn.forward(vol);
    let accuracymatch = predicted_values.w[0] === current_price;
    this.nn.backward(accuracymatch);
    this.predictionCount++;
  }
};

Indicator.prototype.predictCandle = function() {
  let vol = new convnetjs.Vol(this.priceBuffer);
  let prediction = this.nn.forward(vol);
  return prediction.w[0];
};

Indicator.prototype.update = function(candle) {
  this.candle = candle;
  this.priceBuffer.push(candle.close / this.settings.scale);
  if (2 > this.priceBuffer.length) return;

  for (let i = 0; i < 3; ++i) this.learn();

  while (this.settings.price_buffer_len < this.priceBuffer.length)
    this.priceBuffer.shift();

  if (this.predictionCount > this.settings.min_predictions) {
    let prediction = this.predictCandle();
    let currentPrice = candle.close / this.settings.scale;
    this.result.prediction = prediction;
    this.result.meanp = math.mean(prediction, currentPrice);
    this.result.meanAlpha =
      ((this.result.meanp - currentPrice) / currentPrice) * 100;
  }
};

module.exports = Indicator;
