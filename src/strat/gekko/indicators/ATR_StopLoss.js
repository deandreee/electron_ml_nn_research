const IndBase = require("./IndBase");
const ATR = require("./ATR");
const { getCandlesPerPeriod, max, validateSettings } = require("../utils");

// atr_period = atr length
// atr_level = x1 x2 x3 etc ...
class ATR_StopLoss extends IndBase {
  constructor(settings, props) {
    super(Object.assign({}, props, { resultHistory: true }));
    this.input = "candle";

    const { atr_period, atr_level, batchSize } = settings;
    this.atr_period = atr_period;
    this.atr_level = atr_level;
    this._prevAdvice = null;

    validateSettings("ATR_StopLoss", settings, [
      "atr_period",
      "atr_level",
      "batchSize",
    ]);

    const period_candles = getCandlesPerPeriod(atr_period, batchSize);
    this.atr = new ATR(period_candles);
  }

  updateCore(candle) {
    this.candle = candle;
    const atr = this.atr.update(candle);
    const atr_sl_price = candle.close - atr * this.atr_level;

    this.result =
      this._prevAdvice === "long" ? max(atr_sl_price, this.prev) : null;

    this.prev = this.result;

    return this.result;
  }

  isHit() {
    return this.candle.close <= this.result;
  }

  long() {
    this._prevAdvice = "long";
  }

  short() {
    this._prevAdvice = "short";
  }
}

module.exports = ATR_StopLoss;
