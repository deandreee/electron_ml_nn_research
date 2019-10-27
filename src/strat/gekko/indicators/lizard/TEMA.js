const EMA = require("../EMA");

class TEMA {
  constructor(period) {
    this.period = period;
    this.ema1 = new EMA(period);
    this.ema2 = new EMA(period);
    this.ema3 = new EMA(period);
    this.result = null;
  }

  update(price) {
    this.ema1.update(price);
    this.ema2.update(this.ema1.result);
    this.ema3.update(this.ema2.result);
    this.result =
      3 * this.ema1.result - 3 * this.ema2.result + this.ema3.result;
    return this.result;
  }
}

module.exports = TEMA;
