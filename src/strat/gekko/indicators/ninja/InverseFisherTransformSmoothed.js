const IndBase = require("../IndBase");
const RSI = require("../RSI");
const WMA = require("./WMA");
const EMA = require("../EMA");

class InverseFisherTransformSmoothed extends IndBase {
  constructor({ period }, props) {
    super(props);
    this.input = "candle";
    this.result = null;

    this.rsi = new RSI({ interval: period });

    this.wma1 = new WMA(2);
    this.wma2 = new WMA(2);
    this.wma3 = new WMA(2);
    this.wma4 = new WMA(2);
    this.wma5 = new WMA(2);
    this.wma6 = new WMA(2);
    this.wma7 = new WMA(2);
    this.wma8 = new WMA(2);
    this.wma9 = new WMA(2);
    this.wma10 = new WMA(2);

    this.ema1 = new EMA(9);
    this.ema2 = new EMA(9);
  }

  updateCore(candle) {
    // yes, 10 MAs, rainbow
    this.wma1.update(candle.close);
    this.wma2.update(this.wma1.result);
    this.wma3.update(this.wma2.result);
    this.wma4.update(this.wma3.result);
    this.wma5.update(this.wma4.result);
    this.wma6.update(this.wma5.result);
    this.wma7.update(this.wma6.result);
    this.wma8.update(this.wma7.result);
    this.wma9.update(this.wma8.result);
    this.wma10.update(this.wma9.result);

    const rainbow =
      (5 * this.wma1.result +
        4 * this.wma2.result +
        3 * this.wma3.result +
        2 * this.wma4.result +
        this.wma5.result +
        this.wma6.result +
        this.wma7.result +
        this.wma8.result +
        this.wma9.result +
        this.wma10.result) /
      20;

    // now multiply with coeffs
    this.rsi.update({ close: rainbow }); // rsi only needs close

    const x = 0.1 * (this.rsi.result - 50); // basically v1 from IFT
    this.ema1.update(x);
    this.ema2.update(this.ema1.result);
    const diff = this.ema1.result - this.ema2.result;
    const zlema = this.ema1.result + diff;
    const invFish =
      ((Math.exp(2 * zlema) - 1) / (Math.exp(2 * zlema) + 1) + 1) * 50;

    this.result = invFish;
    return this.result;
  }
}

module.exports = InverseFisherTransformSmoothed;
