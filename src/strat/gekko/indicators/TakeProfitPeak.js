const getPctChange = require("../utils/getPctChange");

class TakeProfitPeak {
  constructor() {
    this.candleHistory = [];
    this.resultHistory = [];
  }

  getPrevClose(i) {
    const idx = this.candleHistory.length - 1 - i;
    if (idx >= 0 && this.candleHistory.length - 1 >= idx) {
      return this.candleHistory[idx].close;
    }
    return null;
  }

  getPctChangeWithGuard(curr, prev) {
    if (prev) {
      return getPctChange(curr, prev);
    }
    return null;
  }

  // sudden fast change that won't last long, wait, Stir the cream and get out
  isFlashRise(candle) {
    const change1m = this.getPctChangeWithGuard(
      candle.close,
      this.getPrevClose(1)
    );
    const change2m = this.getPctChangeWithGuard(
      candle.close,
      this.getPrevClose(2)
    );
    const change5m = this.getPctChangeWithGuard(
      candle.close,
      this.getPrevClose(5)
    );
    const change10m = this.getPctChangeWithGuard(
      candle.close,
      this.getPrevClose(10)
    );

    if (change1m >= 1) {
      return "1m";
    }
    if (change2m >= 1) {
      return "2m";
    }
    if (change5m >= 2) {
      return "5m";
    }
    if (change10m >= 3) {
      return "10m";
    }

    return null;
  }

  isFlashDrop(candle) {
    const change1m = this.getPctChangeWithGuard(
      candle.close,
      this.getPrevClose(1)
    );
    const change2m = this.getPctChangeWithGuard(
      candle.close,
      this.getPrevClose(2)
    );
    const change5m = this.getPctChangeWithGuard(
      candle.close,
      this.getPrevClose(5)
    );
    const change10m = this.getPctChangeWithGuard(
      candle.close,
      this.getPrevClose(10)
    );

    if (change1m <= -2) {
      return "1m";
    }
    if (change2m <= -2) {
      return "2m";
    }
    if (change5m <= -3) {
      return "5m";
    }
    if (change10m <= -5) {
      return "10m";
    }

    return null;
  }

  update(candle) {
    const isFlashRise = this.isFlashRise(candle);
    const isFlashDrop = this.isFlashDrop(candle);
    this.candleHistory.push(candle);
    this.result = { isFlashRise, isFlashDrop };
    this.resultHistory.push(this.result);
    return this.result;
  }
}

module.exports.TakeProfitPeak = TakeProfitPeak;
