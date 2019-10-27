// @link http://www.stockcharts.com/school/doku.php?id=chart_school:technical_indicators:average_true_range_atr
// formula http://www.fmlabs.com/reference/default.htm?url=ATR.htm
// Gab0 - 01/24/2018

const TRANGE = require("./TRANGE.js");
const SMMA = require("./SMMA.js");
const IndBase = require("./IndBase");

class ATR extends IndBase {
  constructor(period, props) {
    super(props);

    this.input = "candle";

    this.indicates = "volatility"; //info purpose

    this.result = false;
    this.age = 0;

    this.trange = new TRANGE();
    this.smooth = new SMMA(period);
  }

  updateCore(candle) {
    // The first time we can't calculate based on previous
    // ema, because we haven't calculated any yet.
    this.trange.update(candle);
    this.smooth.update(this.trange.result);

    this.result = this.smooth.result;

    this.age++;
    return this.result;
  }
}

module.exports = ATR;
