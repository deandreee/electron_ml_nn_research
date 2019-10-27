// required indicators
const MFI = require("technicalindicators").MFI;
const IndBase = require("./IndBase");

class MFI_ extends IndBase {
  constructor(period, props) {
    super(props);
    this.input = "candle";
    this.period = period;
    this.mfi = new MFI({ high: [], low: [], close: [], volume: [], period });
  }

  updateCore(candle) {
    this.result = this.mfi.nextValue({
      close: candle.close,
      high: candle.high,
      low: candle.low,
      volume: candle.volume,
    });
    return this.result;
  }
}

module.exports = MFI_;
