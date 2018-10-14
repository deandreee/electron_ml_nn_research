import { isArray, isNumber, reduce, min, max } from "lodash";
import { Candle } from "../../types";

export class CandleBatcher2 {
  candleSize: number;
  smallCandles: Candle[];
  calcCandle: Candle | null;

  constructor(candleSize: number) {
    if (!isNumber(candleSize)) {
      throw new Error("candleSize is not a number");
    }

    this.candleSize = candleSize;
    this.smallCandles = [];
    this.calcCandle = null;
  }

  write = (candles: Candle[]) => {
    if (!isArray(candles)) {
      throw new Error("candles is not an array");
    }

    for (let x of candles) {
      this.smallCandles.push(x);
    }
  };

  check = () => {
    let calcCandle = this.calculate();
    this.smallCandles = [];
    this.calcCandle = calcCandle;
    return calcCandle;
  };

  copyCandle = (candle: Candle): Candle => {
    return {
      start: candle.start,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
      vwp: candle.vwp,
      trades: candle.trades,
      percentChange: candle.percentChange,
      pctChange60m: candle.pctChange60m,
      pctChange: candle.pctChange
    };
  };

  calculate = () => {
    if (this.smallCandles.length !== this.candleSize) {
      throw new Error(
        `CandleBatcher2: smallCandles.length (${this.smallCandles.length}) not EQUAL to candleSize (${this.candleSize})`
      );
    }

    let first = this.copyCandle(this.smallCandles[0]);

    first.vwp = first.vwp * first.volume;

    var candle = reduce(
      this.smallCandles.slice(1),
      function(candle, m) {
        candle.high = max([candle.high, m.high]);
        candle.low = min([candle.low, m.low]);
        candle.close = m.close;
        candle.volume += m.volume;
        candle.vwp += m.vwp * m.volume;
        candle.trades += m.trades;
        return candle;
      },
      first
    );

    if (candle.volume)
      // we have added up all prices (relative to volume)
      // now divide by volume to get the Volume Weighted Price
      candle.vwp /= candle.volume;
    // empty candle
    else candle.vwp = candle.open;

    candle.start = first.start;

    return candle;
  };
}
