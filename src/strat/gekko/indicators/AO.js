const AwesomeOscillator = require("lessertechnicalindicators").AwesomeOscillator;
const IndBase = require("./IndBase");

// seems broken

class Indicator extends IndBase {
  constructor(settings, props) {
    super(props);
    this.input = "candle";
    this.settings = settings;

    // https://www.tradingview.com/wiki/Awesome_Oscillator_(AO) => defaults 34/5 ?
    // yes same here https://github.com/anandanand84/technicalindicators/blob/master/test/oscillators/AwesomeOscillator.js
    this.ind = new AwesomeOscillator({
      fastPeriod: this.settings.fastPeriod || 5,
      slowPeriod: this.settings.slowPeriod || 34,
      high: [],
      low: []
    });
  }

  updateCore(candle) {
    this.result = this.ind.nextValue({
      low: candle.low,
      high: candle.high
    });
    return this.result;
  }
}

module.exports = Indicator;
