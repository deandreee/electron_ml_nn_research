// required indicators: SMA;
// port by Gab0 - 2017
// not exact results when compared to TA-Lib but GOOD ENOUGH;
// Bollinger Bands implementation;

// ask: Jan 11 don't use this, it's BROKEN
// ask: Mar 20 add back for backtests ... :/

var SMA = require("./SMA.js");
var Indicator = function(BBSettings) {
  this.input = "price";
  this.settings = BBSettings;

  this.center = new SMA(this.settings.TimePeriod);

  this.lower = 0;
  this.middle = 0;
  this.upper = 0;
};

Indicator.prototype.calcstd = function(prices, Average) {
  var squareDiffs = prices.map(function(value) {
    var diff = value - Average;
    var sqr = diff * diff;
    return sqr;
  });

  var sum = squareDiffs.reduce(function(sum, value) {
    return sum + value;
  }, 0);

  var avgSquareDiff = sum / squareDiffs.length;

  return Math.sqrt(avgSquareDiff);
};

Indicator.prototype.update = function(price) {
  this.center.update(price);

  this.middle = this.center.result;
  var std = this.calcstd(this.center.prices, this.middle);

  this.lower = this.middle - this.settings.NbDevDn * std;
  this.upper = this.middle + this.settings.NbDevUp * std;

  this.result = { upper: this.upper, lower: this.lower };
  return this.result;
};

module.exports = Indicator;
