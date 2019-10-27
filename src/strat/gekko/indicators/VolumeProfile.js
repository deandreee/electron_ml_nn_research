const VolumeProfile = require("technicalindicators").VolumeProfile;
const IndBase = require("./IndBase");

// Next value not supported for volume profile
// nice

class Indicator extends IndBase {
  constructor(settings, props) {
    super(props);
    this.input = "candle";
    this.settings = settings;

    // default is 1 ... :/
    this.ind = new VolumeProfile({
      noOfBars: this.settings.noOfBars || 14,
      high: [],
      low: [],
      open: [],
      close: [],
      volume: [],
    });
  }

  updateCore(candle) {
    this.result = this.ind.nextValue({
      high: candle.high,
      low: candle.low,
      open: candle.open,
      close: candle.close,
      volume: candle.volume,
    });
    return this.result;
  }
}

module.exports = Indicator;
