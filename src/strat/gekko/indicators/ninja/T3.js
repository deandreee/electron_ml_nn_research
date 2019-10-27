const EMA = require("../EMA");

// ninjatrader forums https://ninjatrader.com/support/forum/local_links.php
class T3 {
  constructor(period, props) {
    this.period = period;

    if (!this.period) {
      throw new Error("T3: period not set");
    }

    this.props = props || {};
    this.amp = 0.7;
    this.ema1 = new EMA(period);
    this.ema2 = new EMA(period);
    this.ema3 = new EMA(period);
    this.ema4 = new EMA(period);
    this.ema5 = new EMA(period);
    this.ema6 = new EMA(period);
    this.result = null;
    this.resultHistory = [];
  }

  getTypical(candle) {
    return (candle.high + candle.low + candle.close) / 3;
  }

  update(candle) {
    if (!candle) {
      if (this.props.resultHistory) {
        this.resultHistory.push(this.result);
      }
      this.result = null;
      return;
    }

    const typical = this.getTypical(candle); // originally uses close but for 120m close just doesn't make sense anymore
    this.ema1.update(typical);
    this.ema2.update(this.ema1.result);
    this.ema3.update(this.ema2.result);
    this.ema4.update(this.ema3.result);
    this.ema5.update(this.ema4.result);
    this.ema6.update(this.ema5.result);

    const amp = this.amp;
    const c1 = -amp * amp * amp;
    const c2 = 3 * amp * amp + 3 * amp * amp * amp;
    const c3 = -6 * amp * amp - 3 * amp - 3 * amp * amp * amp;
    const c4 = 1 + 3 * amp + amp * amp * amp + 3 * amp * amp;

    this.result =
      c1 * this.ema6.result +
      c2 * this.ema5.result +
      c3 * this.ema4.result +
      c4 * this.ema3.result;

    if (this.props.resultHistory) {
      this.resultHistory.push(this.result);
    }

    return this.result;
  }
}

module.exports = T3;
