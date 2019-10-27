const TEMA = require("./TEMA");

// This is an implementation of the Zero-Lagging Heiken-Ashi TEMA
// anaZeroLagHATEMA was original name btw
class ZeroLagHATEMA {
  constructor(period, props) {
    this.props = props || {};
    this.period = period;
    this.tema1 = new TEMA(period);
    this.tema2 = new TEMA(period);
    this.prev = null;
    this.result = null;
    this.resultHistory = [];
  }

  update(candle) {
    if (!candle) {
      if (this.props.resultHistory) {
        this.resultHistory.push(null);
      }
      return null;
    }

    if (!this.prev) {
      this.prev = {
        haOpen: candle.open,
        candle: candle,
      };
      if (this.props.resultHistory) {
        this.resultHistory.push(null);
      }
      return null;
    }

    const haOpen =
      ((this.prev.candle.open +
        this.prev.candle.high +
        this.prev.candle.low +
        this.prev.candle.close) /
        4 +
        this.prev.haOpen) /
      2;

    const haClose =
      ((candle.open + candle.high + candle.low + candle.close) / 4 +
        haOpen +
        Math.max(candle.high, haOpen) +
        Math.min(candle.low, haOpen)) /
      4;

    this.tema1.update(haClose);
    this.tema2.update(this.tema1.result);

    this.result = 2 * this.tema1.result - this.tema2.result;

    this.prev = {
      candle,
      haOpen,
    };

    if (this.props.resultHistory) {
      this.resultHistory.push(this.result);
    }

    return this.result || null;
  }
}

module.exports = ZeroLagHATEMA;
