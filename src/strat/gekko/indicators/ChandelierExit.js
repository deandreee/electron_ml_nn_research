const ChandelierExit = require("technicalindicators").ChandelierExit;
const IndBase = require("./IndBase");

class Indicator extends IndBase {
  constructor(settings, props) {
    super(props);
    this.input = "candle";
    this.settings = settings;

    //github.com/anandanand84/technicalindicators/blob/master/src/volatility/ChandelierExit.ts
    this.ti = new ChandelierExit({
      period: this.settings.period || 22,
      multiplier: this.settings.multiplier || 3,
      high: [],
      low: [],
      close: [],
    });
  }

  // returns { exitLong, exitShort }
  updateCore(candle) {
    const val = this.ti.nextValue({
      low: candle.low,
      high: candle.high,
      close: candle.close,
    });
    this.result = val || {};
    return this.result;
  }
}

module.exports = Indicator;
