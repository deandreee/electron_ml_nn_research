var SMMA = require("./SMMA.js");
var convnetjs = require("convnetjs");
var math = require("mathjs");
var log = require("../../core/log.js");

var Indicator = function(settings) {
  this.input = "candle";
  this.priceBuffer = [];
  this.price_buffer_len = settings.price_buffer_len;
  this.scale = 1;
  this.prediction = 0;

  this.SMMA = new SMMA(settings.NN_SMMA_Length);

  let layers = [
    { type: "input", out_sx: 1, out_sy: 1, out_depth: 1 },
    { type: "fc", num_neurons: 0, activation: "tanh" },
    { type: "regression", num_neurons: 1 },
  ];

  this.nn = new convnetjs.Net();

  this.nn.makeLayers(layers);

  this.trainer = new convnetjs.Trainer(this.nn, {
    method: "adadelta",
    batch_size: 1,
    eps: 1e-6,
    ro: 0.95,
    l2_decay: settings.decay,
  });
};

Indicator.prototype.setNormalizeFactor = function(candle) {
  this.scale = Math.pow(10, Math.trunc(candle.high).toString().length + 2);
  log.debug("Set normalization factor to", this.scale);
};

Indicator.prototype.learn = function() {
  for (let i = 0; i < this.priceBuffer.length - 1; i++) {
    let data = [this.priceBuffer[i]];
    let current_price = [this.priceBuffer[i + 1]];
    let vol = new convnetjs.Vol(data);
    this.trainer.train(vol, current_price);
  }
};

Indicator.prototype.predictCandle = function() {
  let vol = new convnetjs.Vol(this.priceBuffer);
  let prediction = this.nn.forward(vol);
  return prediction.w[0];
};

Indicator.prototype.update = function(candle) {
  this.SMMA.update((candle.high + candle.close + candle.low + candle.vwp) / 4);
  let smmaFast = this.SMMA.result;

  if (1 === this.scale && 1 < candle.high && 0 === this.predictionCount)
    this.setNormalizeFactor(candle);

  this.priceBuffer.push(smmaFast / this.scale);
  if (2 > this.priceBuffer.length) return;

  this.learn();

  while (this.price_buffer_len < this.priceBuffer.length)
    this.priceBuffer.shift();

  this.prediction = this.predictCandle() * this.scale;
};

module.exports = Indicator;
