const IndBase = require("./IndBase");
const ChandelierExit = require("./ChandelierExit");
const { getCandlesPerPeriod, max, validateSettings } = require("../utils");

class Chande_StopLoss extends IndBase {
  constructor(settings, props) {
    super(Object.assign({}, props, { resultHistory: true }));
    this.input = "candle";

    const { period, multiplier, batchSize } = settings;
    this.period = period;
    this.multiplier = multiplier;
    this._prevAdvice = null;

    validateSettings("Chande_StopLoss", settings, [
      "period",
      "multiplier",
      "batchSize",
    ]);

    const period_candles = getCandlesPerPeriod(period, batchSize);
    this.chandelierExit = new ChandelierExit({
      period: period_candles,
      multiplier,
    });
  }

  updateCore(candle) {
    this.candle = candle;
    const { exitLong } = this.chandelierExit.update(candle);

    // this.result = this._prevAdvice === "long" ? exitLong : null;
    this.result = exitLong;
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

module.exports = Chande_StopLoss;
