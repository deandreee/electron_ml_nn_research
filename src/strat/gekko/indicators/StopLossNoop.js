const IndBase = require("./IndBase");

// for simplicity, so I don't have to check all the time ...
// just implement all functions
class StopLossNoop extends IndBase {
  // so we don't have to copy this.resultHistory logic
  constructor(props) {
    super(Object.assign({}, props, { resultHistory: true }));
    this.input = "candle";
    this.result = null;
  }

  updateCore(candle) {
    this.result = null;
    return this.result;
  }

  isHit() {
    return false;
  }

  long() {}

  short() {}
}

module.exports = StopLossNoop;
