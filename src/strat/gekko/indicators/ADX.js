// Average Directional Movement Index indicator;
// usable on gekko trading bot. Same license as gekko.
// "ported" from tulip: https://tulipindicators.org/adx
// gab0 - 2018

const IndBase = require("./IndBase");
const DX = require("./DX.js");

class ADX extends IndBase {
  constructor(period, props) {
    super(props);

    this.input = "candle";
    this.indicates = "trend_strength";

    this.dx = new DX(period);

    this.result = 0;
    this.periodRatio = (period - 1) / period;
    this.initadx = 0;
    this.initialized = 1;
    this.period = period;
  }

  updateCore(candle) {
    this.dx.update(candle);

    if (this.initialized > this.period)
      this.result =
        this.periodRatio * this.result + this.dx.result / this.period;
    else if (this.initialized == this.period) {
      this.initialized++;
      this.result = this.initadx / this.period;
    } else if (this.dx.result) {
      this.initadx += this.dx.result;
      this.initialized += 1;
    }

    this.age++;

    return this.result;
  }
}

module.exports = ADX;
