const ZerolagHATEMA = require("../lizard/ZerolagHATEMA");

// ninjatrader forums https://ninjatrader.com/support/forum/local_links.php
class ZerolagT3 {
  constructor(period) {
    this.period = period;
    this.amp = 0.7;
    this.ema1 = new ZerolagHATEMA(period);
    this.ema2 = new ZerolagHATEMA(period);
    this.ema3 = new ZerolagHATEMA(period);
    this.ema4 = new ZerolagHATEMA(period);
    this.ema5 = new ZerolagHATEMA(period);
    this.ema6 = new ZerolagHATEMA(period);
    this.result = null;
  }

  getTypical(candle) {
    return (candle.high + candle.low + candle.close) / 3;
  }

  valueToHLC(value) {
    return { open: value, high: value, low: value, close: value };
  }

  update(candle) {
    this.ema1.update(candle);
    this.ema2.update(this.valueToHLC(this.ema1.result));
    this.ema3.update(this.valueToHLC(this.ema2.result));
    this.ema4.update(this.valueToHLC(this.ema3.result));
    this.ema5.update(this.valueToHLC(this.ema4.result));
    this.ema6.update(this.valueToHLC(this.ema5.result));

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

    return this.result;
  }
}

module.exports = ZerolagT3;
