import { CoinData, Candle } from "../types";
import { TimeFrame } from "../features/common";
import { BatchConfig } from "./BatchConfig";
import { round2 } from "../utils";

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

  isInt = (n: number) => {
    return n % 1 === 0;
  };

  // candles actual is used further, but we still need to see the diff n periods ago,
  // so we look into full candles
  // this is just by idx, ot depending on df, so will differ between tfs
  getPrev = (curr: number, minus: number) => {
    return this.candles[curr - minus + this.batchConfig.warmupIndCount];
  };

  getPrevHrs = (curr: number, minus: number) => {
    const div = 60 / this.batchConfig.batchSize;

    const minusCandles = div * minus;
    if (!this.isInt(minusCandles)) {
      throw new Error(`getPrevHrs: not integer (minus ${minus} | div ${round2(div)})`);
    }

    return this.candles[curr - minusCandles + this.batchConfig.warmupIndCount];
  };

  // https://www.evernote.com/Home.action?login=true#n=5d6db76a-2b78-445a-853b-cb151e9bc15d&s=s202&ses=4&sh=2&sds=5&
  // used in tests
  // basically, when compring indicators, we are intereseted when candles end, not start
  // tradingView has start, but values are only comparable at the end
  getCandleEndsAt = (date: Date, tf: TimeFrame) => {
    return this.getCandleWithOffset(date, tf, false);
  };

  // this will be more understandable ...
  // this is not starts, this is get candle for IND that starts in that timeframe ...
  getCandleStartsAt = (date: Date, tf: TimeFrame) => {
    return this.getCandleWithOffset(date, tf, true);
  };

  getCandleWithOffset = (date: Date, tf: TimeFrame, plus: boolean) => {
    const tsUnix = Math.floor(date.getTime() / 1000);

    const tfBatched = this.batchConfig.batchSize;
    const tfWave = parseInt(tf.toString().replace("x", ""));

    if (tfWave < tfBatched) {
      throw new Error(`tfWave (${tfWave}) < tfBatched (${tfBatched})`);
    }

    const diff = tfWave / tfBatched;

    // like (60 * 4) - 60
    let tsUnixAdjusted: number = null;
    if (plus) {
      const diffMins = tfBatched * diff - tfBatched;
      const diffSeconds = diffMins * 60;
      tsUnixAdjusted = tsUnix + (plus ? diffSeconds : -diffSeconds);
    } else {
      const diffMins = tfBatched * diff;
      const diffSeconds = diffMins * 60;
      tsUnixAdjusted = tsUnix + (plus ? diffSeconds : -diffSeconds);
    }

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

    throw new Error(`getCandleWithOffset ${date.toISOString()} not found`);
  };
}
