const CandleBatcher = function(candleSize) {
  if (!candleSize) {
    throw "candleSize is not a number";
  }

  this.candleSize = candleSize;

  this.smallCandlesIdx = 0;
  this.smallCandles = new Array(candleSize);
  // this.smallCandles = [];

  this.calcCandle = null;
};

CandleBatcher.prototype.write = function(candle) {
  this.smallCandles[this.smallCandlesIdx++] = candle;
  // this.smallCandles.push(candle);
};

CandleBatcher.prototype.check = function() {
  let calcCandle = this.calculate();

  // keeping for debug, so I can check just returned smallCandles
  this._prevSmallCandles = this.smallCandles;

  this.smallCandles = new Array(this.candleSize);
  this.smallCandlesIdx = 0;
  // this.smallCandles = [];
  // this.smallCandles.length = 0;

  this.calcCandle = calcCandle;
  return calcCandle;
};

// since it's simple object, just take props manually instead of Object.assign
// for perf
CandleBatcher.prototype.cloneFirstCandle = function() {
  const first = this.smallCandles[0];
  return {
    start: first.start,
    open: first.open,
    high: first.high,
    low: first.low,
    close: first.close,
    vwp: first.vwp,
    volume: first.volume,
    trades: first.trades,
  };
};

CandleBatcher.prototype.calculate = function() {
  if (this.smallCandles.length !== this.candleSize) {
    throw new Error(
      `CandleBatcher2: smallCandles.length (${this.smallCandles.length}) not EQUAL to candleSize (${this.candleSize})`
    );
  }

  let bigCandle = this.cloneFirstCandle();
  bigCandle.vwp = bigCandle.vwp * bigCandle.volume;

  for (let i = 0; i < this.smallCandles.length; i++) {
    if (i === 0) {
      continue;
    }

    let m = this.smallCandles[i];

    bigCandle.high = Math.max(bigCandle.high, m.high);
    bigCandle.low = Math.min(bigCandle.low, m.low);
    bigCandle.close = m.close;
    bigCandle.volume += m.volume;
    bigCandle.vwp += m.vwp * m.volume;
    bigCandle.trades += m.trades;
  }

  if (bigCandle.volume)
    // we have added up all prices (relative to volume)
    // now divide by volume to get the Volume Weighted Price
    bigCandle.vwp /= bigCandle.volume;
  // empty candle
  else {
    bigCandle.vwp = bigCandle.open;
  }

  // bigCandle.start = bigCandle.start; // already set in clone

  return bigCandle;
};

module.exports = CandleBatcher;
