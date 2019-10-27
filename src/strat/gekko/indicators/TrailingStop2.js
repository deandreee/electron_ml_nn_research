const log = require("../../core/log");

// lossPercent = round percent, like 5
// taken from zTrailingStop, let's leave that on intact and add resultHistory here
// and also switch to candle.close not high, highs are very distorted...
const Indicator = function(lossPercent) {
  this.input = "candle";
  this.lastHighPrice = 0;
  this.shouldSell = false;
  this.lossPercent = lossPercent;
  this.timesStopped = 0;
  this.resultHistory = [];
};

Indicator.prototype.update = function(candle) {
  // const price = candle.high;
  const price = candle.close; // ask: changed here to close
  if (price > this.lastHighPrice) {
    this.lastHighPrice = price; // ask: changed here to close
    this.shouldSell = false;
  }

  const stopPrice = this.lastHighPrice * ((100 - this.lossPercent) / 100);
  if (this.isActive() && candle.close < stopPrice) {
    // triggering stoploss here
    // this might not always result in a sell, because cooldown
    this.shouldSell = true;

    // yeah can't set here, because not always results in sell
    // this.lastHighPrice = null;
  }

  // this.resultHistory.push(this.stopPrice);
  // this.resultHistory.push(this.lastHighPrice);
  this.resultHistory.push(
    // easier to read chart this way, only log if stoploss active
    // this.isActive() ? this.lastHighPrice : null
    // wow, should be stopPrice not lastHighPrice right
    this.isActive() ? stopPrice : null
  );

  return stopPrice;
};

Indicator.prototype.isHit = function() {
  return this.shouldSell;
};

Indicator.prototype.isActive = function() {
  return this.previousAction == "buy";
};

Indicator.prototype.long = function(price) {
  // sheet, only the first time ... :/ this breaks everything
  if (!this.isActive()) {
    this.lastHighPrice = price;
    this.shouldSell = false;
  }
  this.previousAction = "buy";
};
Indicator.prototype.short = function(price) {
  // and reverse here
  if (this.isActive()) {
    this.lastHighPrice = null;
    this.shouldSell = false;
  }
  this.previousAction = "sell";
};
module.exports = Indicator;
