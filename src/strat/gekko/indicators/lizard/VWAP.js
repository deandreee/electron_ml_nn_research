// taken from mtExpVWAP
class VWAP {
  constructor(period) {
    this.period = period;
    this.input = "candle";
    this.alpha = 1 - 2 / (period + 1);
    this.num = null; // numerator
    this.den = null; // denominator?
    this.prev = null;
  }

  update(candle) {
    const price = (candle.high + candle.low + candle.close) / 3;
    if (!this.prev) {
      this.num = (1 - this.alpha) * candle.volume * price;
      this.den = (1 - this.alpha) * candle.volume;
    } else {
      this.num =
        this.alpha * this.prev.num + (1 - this.alpha) * candle.volume * price;
      this.den = this.alpha * this.prev.den + (1 - this.alpha) * candle.volume;
    }

    this.prev = { num: this.num, den: this.den };
    this.result = { num: this.num, den: this.den };
    return this.result;
  }
}

module.exports = VWAP;
