// const log = require("../../core/log");
const { getCandlesPerPeriod, Queue, validateSettings } = require("../utils");

class FlashCrashStopLoss {
  constructor(settings) {
    this.input = "candle";
    this.shouldSell = false;

    const { period, batchSize, lossPercent } = settings;

    validateSettings("FlashCrashStopLoss", settings, [
      "period",
      "batchSize",
      "lossPercent",
    ]);

    this.period = period;
    this.batchSize = batchSize;
    this.lossPercent = lossPercent;

    this.resultHistory = [];

    const queuePeriod = getCandlesPerPeriod(period, batchSize);
    this.history = new Queue(queuePeriod);
  }

  update(candle) {
    const price = candle.close;

    // we actually don't need queue per se
    // we just need to compare curr close vs close period ago...
    const prevPrice = this.history.enqueue(price);
    if (!prevPrice) {
      this.resultHistory.push(null);
      return null;
    }
    const stopPrice = prevPrice * ((100 - this.lossPercent) / 100);

    if (this.isActive() && candle.close < stopPrice) {
      // triggering stoploss here
      // this might not always result in a sell, because cooldown
      this.shouldSell = true;
    }

    this.result = this.isActive() ? stopPrice : null;
    this.resultHistory.push(this.result);

    return stopPrice;
  }

  isHit() {
    return this.shouldSell;
  }

  isActive() {
    return this.previousAction == "buy";
  }

  long(price) {
    // sheet, only the first time ... :/ this breaks everything
    if (!this.isActive()) {
      this.shouldSell = false;
    }
    this.previousAction = "buy";
  }

  short(price) {
    // and reverse here
    if (this.isActive()) {
      this.shouldSell = false;
    }
    this.previousAction = "sell";
  }
}

module.exports = FlashCrashStopLoss;
