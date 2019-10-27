const WilliamsR = require("technicalindicators").WilliamsR;
const IndBase = require("./IndBase");

class Indicator extends IndBase {
  constructor(settings, props) {
    super(props);
    this.input = "candle";
    this.settings = settings;

    // https://github.com/anandanand84/technicalindicators/blob/master/src/momentum/WilliamsR.ts
    this.ind = new WilliamsR({
      period: this.settings.period || 20,
      high: [],
      low: [],
      close: [],
    });
  }

  updateCore(candle) {
    this.result = this.ind.nextValue({
      low: candle.low,
      high: candle.high,
      close: candle.close,
    });
    return this.result;
  }
}

module.exports = Indicator;
