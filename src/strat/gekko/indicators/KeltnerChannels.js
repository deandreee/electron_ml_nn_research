const KeltnerChannels = require("technicalindicators").KeltnerChannels;
const IndBase = require("./IndBase");

class Indicator extends IndBase {
  constructor(settings, props) {
    super(props);
    this.input = "candle";
    this.settings = settings;

    // https://github.com/anandanand84/technicalindicators/blob/83c81c41b925947b5d693c67b6cc07385e48e492/src/volatility/KeltnerChannels.ts
    this.ind = new KeltnerChannels({
      maPeriod: this.settings.maPeriod || 20,
      atrPeriod: this.settings.atrPeriod || 10,
      useSMA: false, // SMA or EMA basically
      multiplier: this.settings.multiplier || 1,
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
