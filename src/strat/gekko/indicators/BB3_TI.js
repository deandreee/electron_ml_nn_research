const BollingerBands = require("lessertechnicalindicators").BollingerBands;
const IndBase = require("./IndBase");

// this one seems by far the best, the other ones have weird results

class Indicator extends IndBase {
  constructor(settings, props) {
    super(props);
    this.input = "price";
    this.settings = settings;

    if (this.settings.NbDevDn !== this.settings.NbDevUp) {
      throw new Error("technicalindicators requires NbDevDn/NbDevUp to match");
    }

    this.bbands = new BollingerBands({
      values: [],
      period: this.settings.TimePeriod,
      stdDev: this.settings.NbDevDn
    });
  }

  updateCore(price) {
    this.result = this.bbands.nextValue(price);
    return this.result;
  }
}

module.exports = Indicator;
