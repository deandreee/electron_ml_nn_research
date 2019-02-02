import { CoinData, Candle } from "../types";
import { TimeFrame } from "../features/common";
import { BatchConfig } from "./BatchConfig";

export class CorrCandles {
  coin: CoinData;
  candles: Candle[];
  candlesActual: Candle[];
  batchConfig: BatchConfig;

  constructor(coin: CoinData, candles: Candle[], candlesActual: Candle[], batchConfig: BatchConfig) {
    this.coin = coin;
    this.candles = candles;
    this.candlesActual = candlesActual;
    this.batchConfig = batchConfig;
  }

  // candles actual is used further, but we still need to see the diff n periods ago,
  // so we look into full candles
  // this is just by idx, ot depending on df, so will differ between tfs
  getPrev = (curr: number, minus: number) => {
    return this.candles[curr - minus + this.batchConfig.warmupIndCount];
  };

  // https://www.evernote.com/Home.action?login=true#n=5d6db76a-2b78-445a-853b-cb151e9bc15d&s=s202&ses=4&sh=2&sds=5&
  // used in tests
  // basically, when compring indicators, we are intereseted when candles end, not start
  // tradingView has start, but values are only comparable at the end
  getCandleEndsAt = (date: Date, tf: TimeFrame) => {
    const tsUnix = Math.floor(date.getTime() / 1000);

    const tfBatched = this.batchConfig.batchSize;
    const tfWave = parseInt(tf.toString().replace("x", ""));

    if (tfWave < tfBatched) {
      throw new Error(`tfWave (${tfWave}) < tfBatched (${tfBatched})`);
    }

    const diff = tfWave / tfBatched;

    // like (60 * 4) - 60
    const minusMins = tfBatched * diff;
    const minusSeconds = minusMins * 60;
    const tsUnixAdjusted = tsUnix - minusSeconds;

    const candle = this.candlesActual.find(x => x.start === tsUnixAdjusted);
    if (candle) {
      return candle;
    }

    // usually we'll want in scope, but let's add this just a backup...
    // don't start in full candles because there is a lot (because x1440)
    const candleBehind = this.candles.find(x => x.start === tsUnixAdjusted);
    if (candleBehind) {
      return candleBehind;
    }

    throw new Error(`getCandleEndsAt ${date.toISOString()} not found`);
  };
}
