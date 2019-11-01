const ForceIndex = require("lessertechnicalindicators").ForceIndex;
const IndBase = require("./IndBase");

// doesn't seem too useful
// basically very raw vol x close

class Indicator extends IndBase {
  constructor(settings, props) {
    super(props);
    this.input = "candle";
    this.settings = settings;

    // default is 1 ... :/
    this.ind = new ForceIndex({
      period: this.settings.period || 1,
      close: [],
      volume: []
    });
  }

  updateCore(candle) {
    this.result = this.ind.nextValue({
      close: candle.close,
      volume: candle.volume
    });
    return this.result;
  }
}

module.exports = Indicator;
