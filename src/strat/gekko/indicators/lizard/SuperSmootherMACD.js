// required indicators
var SuperSmoother = require("./SuperSmoother");

var Indicator = function(config) {
  this.input = "price";
  this.diff = false;

  this.short = new SuperSmoother({ period: config.short, poles: 2 });
  this.long = new SuperSmoother({ period: config.long, poles: 2 });
  this.signal = new SuperSmoother({ period: config.signal, poles: 2 });
};

Indicator.prototype.update = function(price) {
  this.short.update(price);
  this.long.update(price);
  this.calculateEMAdiff();
  this.signal.update(this.diff);
  this.result = this.diff - this.signal.result;

  return {
    signal: this.signal.result,
    diff: this.diff,
    histo: this.diff - this.signal.result,
  };
};

Indicator.prototype.calculateEMAdiff = function() {
  var shortEMA = this.short.result;
  var longEMA = this.long.result;

  this.diff = shortEMA - longEMA; // MACD Line = 12day EMA – 26day EMA
};

module.exports = Indicator;
