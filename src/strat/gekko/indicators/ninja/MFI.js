// from here https://github.com/redrhinofx/NinjaTrader.Base/blob/master/NTBase/Indicator/%40MFI.cs

class MFI {
  constructor(period) {
    this.period = period;
    this.result = null;
    this.history = [];
    this.prevCandle = null;
  }

  getTypical(candle) {
    return (candle.high + candle.low + candle.close) / 3;
  }

  enqueue(x) {
    let queue = this.history;
    if (queue.length >= this.period) {
      queue.shift();
    }

    queue.push(x);
  }

  getSumPos() {
    return this.history.reduce((acc, curr) => {
      return acc + curr.positive;
    }, 0);
  }

  getSumNeg() {
    return this.history.reduce((acc, curr) => {
      return acc + curr.negative;
    }, 0);
  }

  update(candle) {
    if (!this.prevCandle) {
      this.result = 50; // 50; // ??? since this.result not used, null seems like a better alternative
      this.prevCandle = candle;
      return null;
    }

    const typical = this.getTypical(candle);
    const prevTypical = this.getTypical(this.prevCandle);

    const negative = typical < prevTypical ? typical * candle.volume : 0;
    const positive = typical > prevTypical ? typical * candle.volume : 0;

    this.enqueue({ negative, positive });

    const sumPos = this.getSumPos();
    const sumNeg = this.getSumNeg();

    this.result = sumPos === 0 ? 50 : 100.0 - 100.0 / (1 + sumPos / sumNeg);
    // this.result = 100.0 - 100.0 / (1 + sumPos / sumNeg);

    // it also doesnt seem correct to return 50 if it's all negative, means it's close to 0 not 50 ...

    // return 400; // this.result > 20 ? this.result : 400;
    // console.log("mfi", this.result);
    return this.result;
  }
}

module.exports = MFI;
