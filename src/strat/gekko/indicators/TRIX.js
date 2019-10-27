const TRIX = require("technicalindicators").TRIX;
const IndBase = require("./IndBase");

class Indicator extends IndBase {
  constructor(settings, props) {
    super(props);
    this.input = "price";
    this.settings = settings;

    this.ind = new TRIX({
      period: this.settings.period || 18,
      values: [],
    });
  }

  updateCore(close) {
    this.result = this.ind.nextValue(close);
    return this.result;
  }
}

module.exports = Indicator;
