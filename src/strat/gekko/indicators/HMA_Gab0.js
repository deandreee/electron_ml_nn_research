// this is NOT equal to JMartty !!!

// Gab0 looks better / faster on a glimpse

// HMA ported by Gab0 03/29/2018;
var WMA = require("./WMA_Gab0");

var Indicator = function(weight) {
  this.input = "price";
  this.Twma = new WMA(weight);
  this.Bwma = new WMA(weight / 2);
  this.Mwma = new WMA(Math.sqrt(weight));
  this.weight = weight;
  this.prices = [];
  this.result = 0;
};

Indicator.prototype.update = function(price) {
  this.prices.push(price);

  if (this.prices.length < this.weight) {
    this.result = null;
    return this.result;
  }

  this.Twma.update(price);
  this.Bwma.update(price);

  var Mwmafeed = 2 * this.Bwma.result - this.Twma.result;
  this.Mwma.update(Mwmafeed);

  this.result = this.Mwma.result;

  return this.result;
};

module.exports = Indicator;
