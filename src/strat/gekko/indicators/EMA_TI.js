const EMA = require("technicalindicators").EMA;
const IndBase = require("./IndBase");

class Indicator extends IndBase {
  constructor(period, props) {
    super(props);
    this.input = "price";

    if (!period) {
      throw new Error("period not set");
    }
    this.ind = new EMA({
      period,
      values: [],
    });
  }

  updateCore(price) {
    this.result = this.ind.nextValue(price);
    return this.result;
  }
}

module.exports = Indicator;
