const ATR = require("lessertechnicalindicators").ATR;
const IndBase = require("./IndBase");

class Indicator extends IndBase {
  constructor(period, props) {
    super(props);
    this.input = "candle";

    if (!period) {
      throw new Error("period not set");
    }

    // https://www.tradingview.com/wiki/Awesome_Oscillator_(AO) => defaults 34/5 ?
    // yes same here https://github.com/anandanand84/technicalindicators/blob/master/test/oscillators/AwesomeOscillator.js
    this.ind = new ATR({
      period,
      high: [],
      low: [],
      close: []
    });
  }

  updateCore(candle) {
    this.result = this.ind.nextValue({
      high: candle.high,
      low: candle.low,
      close: candle.close
    });
    return this.result;
  }
}

module.exports = Indicator;
