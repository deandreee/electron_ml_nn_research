// required indicators
var ZerolagHATEMA = require("./ZerolagHATEMA");

var Indicator = function(config) {
  this.input = "price";
  this.diff = false;
  this.short = new ZerolagHATEMA(config.short);
  this.long = new ZerolagHATEMA(config.long);
  this.signal = new ZerolagHATEMA(config.signal);
};

Indicator.prototype.update = function(candle) {
  this.short.update(candle);
  this.long.update(candle);
  this.calculateEMAdiff();
  this.signal.update({
    open: this.diff,
    high: this.diff,
    low: this.diff,
    close: this.diff,
  });
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
