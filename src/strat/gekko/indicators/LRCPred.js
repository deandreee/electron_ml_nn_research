const IndBase = require("./IndBase");
class LRCPred extends IndBase {
  constructor(period, props) {
    super(props);
    this.period = period;
    this.input = "indicator";
  }

  updateCore(lrc) {
    // LRC uses this.depth but we use this period
    // which is longer so we make a prediction
    // if lrc.depth is 60, this.period needs to be 60+x
    this.result = (lrc.depth + this.period - 1) * lrc.m + lrc.b;
    return this.result;
  }
}

module.exports = LRCPred;
