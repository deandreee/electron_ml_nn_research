const ADL = require("technicalindicators").ADL;
const IndBase = require("./IndBase");

// Accumulation Distribution Line (ADL)

// looks like there is no settings ...
// doesn't seem very useful

class Indicator extends IndBase {
  constructor(settings, props) {
    super(props);
    this.input = "candle";
    this.settings = settings;

    // https://github.com/anandanand84/technicalindicators/blob/83c81c41b925947b5d693c67b6cc07385e48e492/src/volatility/KeltnerChannels.ts
    this.ind = new ADL({
      high: [],
      low: [],
      close: [],
      volume: [],
    });
  }

  // returns single number
  updateCore(candle) {
    this.result = this.ind.nextValue({
      low: candle.low,
      high: candle.high,
      close: candle.close,
      volume: candle.volume,
    });
    return this.result;
  }
}

module.exports = Indicator;
