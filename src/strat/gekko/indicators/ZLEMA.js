// made by me ... and NOT REALLY WORKING, this is slower than HMA, so ...
const EMA = require("lessertechnicalindicators").EMA;

class ZLEMA {
  constructor(period) {
    this.period = period;
    this.candleHistory = [];
    this.result = null;
  }

  update(candle) {
    this.candleHistory.push(candle);
    const lag = Math.floor((this.period - 1) / 2);
    const data = this.candleHistory.slice(-this.period);
    const dataMinusLag = this.candleHistory.slice(-this.period + lag);
    const val = EMA.calculate({
      period: this.period,
      values: [...data, ...dataMinusLag].map(x => x.close)
    });

    const result = val.slice(-1)[0];
    this.result = result;
    return result;
  }
}

module.exports = ZLEMA;
