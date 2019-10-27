// required indicators
const SMMA = require("./SMMA.js");
const IndBase = require("./IndBase");

class RSI extends IndBase {
  constructor(settings, props) {
    super(props);
    if (!settings.interval) {
      throw new Error("RSI interval not set");
    }

    this.input = "candle";
    this.lastClose = null;
    this.weight = settings.interval;
    this.avgU = new SMMA(this.weight);
    this.avgD = new SMMA(this.weight);
    this.u = 0;
    this.d = 0;
    this.rs = 0;
    this.result = 0;
    this._age = 0; // need to rename, conflict with IndCore
  }

  updateCore(candle) {
    var currentClose = candle.close;

    if (this.lastClose === null) {
      // Set initial price to prevent invalid change calculation
      this.lastClose = currentClose;

      // Do not calculate RSI for this reason - there's no change!
      // console.log("Do not calculate RSI for this reason - there's no change!");

      this._age++;
      return;
    }

    if (currentClose > this.lastClose) {
      this.u = currentClose - this.lastClose;
      this.d = 0;
    } else {
      this.u = 0;
      this.d = this.lastClose - currentClose;
    }

    this.avgU.update(this.u);
    this.avgD.update(this.d);

    this.rs = this.avgU.result / this.avgD.result;
    this.result = 100 - 100 / (1 + this.rs);

    if (this.avgD.result === 0 && this.avgU.result !== 0) {
      this.result = 100;
    } else if (this.avgD.result === 0) {
      this.result = 0;
    }

    // console.log('RSI', candle.close, this.avgD.result, this.u, this.d);

    this.lastClose = currentClose;
    this._age++;

    return this.result;
  }
}

module.exports = RSI;
