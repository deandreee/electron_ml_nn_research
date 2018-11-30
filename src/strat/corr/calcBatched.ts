import { PctChange, CoinData } from "../types";
import { getCandlePctChange } from "../utils";
import { CorrCandles } from "./CorrCandles";
import { trippleBarrier } from "./trippleBarrier";
// @ts-ignore
const { XmBase, BatchWaveManager, valueToOHLC } = require("../../../../gekko-develop/strategies/utils");

const { MACD, RSI, BBANDS } = require("../../../../gekko-develop/strategies/indicators");

export const CANDLE_SIZE = 10;
export const WARMUP_IND = (240 * 62) / CANDLE_SIZE; // => ind ready
export const EXTENDED = (1500 * 10) / CANDLE_SIZE; // X days

export const corrCalcBatched = (coin: CoinData) => {
  const candles = coin.candles;

  const waveManager10 = new BatchWaveManager(10, CANDLE_SIZE);
  const waveManager30 = new BatchWaveManager(30, CANDLE_SIZE);
  const waveManager60 = new BatchWaveManager(60, CANDLE_SIZE);
  const waveManager120 = new BatchWaveManager(120, CANDLE_SIZE);
  const waveManager240 = new BatchWaveManager(240, CANDLE_SIZE);
  const waveManager480 = new BatchWaveManager(480, CANDLE_SIZE);

  const rsi30x10 = new XmBase(waveManager30, () => new RSI({ interval: 10 }));
  const rsi30x20 = new XmBase(waveManager30, () => new RSI({ interval: 20 }));
  const rsi30x30 = new XmBase(waveManager30, () => new RSI({ interval: 30 }));
  const rsi60x10 = new XmBase(waveManager60, () => new RSI({ interval: 10 }));
  const rsi60x20 = new XmBase(waveManager60, () => new RSI({ interval: 20 }));
  const rsi60x30 = new XmBase(waveManager60, () => new RSI({ interval: 30 }));
  const rsi120x10 = new XmBase(waveManager120, () => new RSI({ interval: 10 }));
  const rsi120x20 = new XmBase(waveManager120, () => new RSI({ interval: 20 }));
  const rsi120x30 = new XmBase(waveManager120, () => new RSI({ interval: 30 }));
  const rsi240x10 = new XmBase(waveManager240, () => new RSI({ interval: 10 }));
  const rsi240x20 = new XmBase(waveManager240, () => new RSI({ interval: 20 }));
  const rsi240x30 = new XmBase(waveManager240, () => new RSI({ interval: 30 }));
  const rsi480x10 = new XmBase(waveManager480, () => new RSI({ interval: 10 }));
  const rsi480x20 = new XmBase(waveManager480, () => new RSI({ interval: 20 }));
  const rsi480x30 = new XmBase(waveManager480, () => new RSI({ interval: 30 }));

  const bbands60_10_1 = new XmBase(waveManager60, () => new BBANDS({ TimePeriod: 10, NbDevUp: 1, NbDevDn: 1 }));
  const bbands60_10_2 = new XmBase(waveManager60, () => new BBANDS({ TimePeriod: 10, NbDevUp: 2, NbDevDn: 2 }));
  const bbands60_10_3 = new XmBase(waveManager60, () => new BBANDS({ TimePeriod: 10, NbDevUp: 3, NbDevDn: 3 }));

  const bbands60_20_1 = new XmBase(waveManager60, () => new BBANDS({ TimePeriod: 20, NbDevUp: 1, NbDevDn: 1 }));
  const bbands60_20_2 = new XmBase(waveManager60, () => new BBANDS({ TimePeriod: 20, NbDevUp: 2, NbDevDn: 2 }));
  const bbands60_20_3 = new XmBase(waveManager60, () => new BBANDS({ TimePeriod: 20, NbDevUp: 3, NbDevDn: 3 }));

  const bbands60_30_1 = new XmBase(waveManager60, () => new BBANDS({ TimePeriod: 30, NbDevUp: 1, NbDevDn: 1 }));
  const bbands60_30_2 = new XmBase(waveManager60, () => new BBANDS({ TimePeriod: 30, NbDevUp: 2, NbDevDn: 2 }));
  const bbands60_30_3 = new XmBase(waveManager60, () => new BBANDS({ TimePeriod: 30, NbDevUp: 3, NbDevDn: 3 }));

  const bbands120_10_1 = new XmBase(waveManager120, () => new BBANDS({ TimePeriod: 10, NbDevUp: 1, NbDevDn: 1 }));
  const bbands120_10_2 = new XmBase(waveManager120, () => new BBANDS({ TimePeriod: 10, NbDevUp: 2, NbDevDn: 2 }));
  const bbands120_10_3 = new XmBase(waveManager120, () => new BBANDS({ TimePeriod: 10, NbDevUp: 3, NbDevDn: 3 }));

  const bbands120_20_1 = new XmBase(waveManager120, () => new BBANDS({ TimePeriod: 20, NbDevUp: 1, NbDevDn: 1 }));
  const bbands120_20_2 = new XmBase(waveManager120, () => new BBANDS({ TimePeriod: 20, NbDevUp: 2, NbDevDn: 2 }));
  const bbands120_20_3 = new XmBase(waveManager120, () => new BBANDS({ TimePeriod: 20, NbDevUp: 3, NbDevDn: 3 }));

  const bbands120_30_1 = new XmBase(waveManager120, () => new BBANDS({ TimePeriod: 30, NbDevUp: 1, NbDevDn: 1 }));
  const bbands120_30_2 = new XmBase(waveManager120, () => new BBANDS({ TimePeriod: 30, NbDevUp: 2, NbDevDn: 2 }));
  const bbands120_30_3 = new XmBase(waveManager120, () => new BBANDS({ TimePeriod: 30, NbDevUp: 3, NbDevDn: 3 }));

  const macd30 = new XmBase(waveManager30, () => new MACD({ short: 12, long: 26, signal: 9 }));
  const macd60 = new XmBase(waveManager60, () => new MACD({ short: 12, long: 26, signal: 9 }));
  const macd120 = new XmBase(waveManager120, () => new MACD({ short: 12, long: 26, signal: 9 }));
  const macd240 = new XmBase(waveManager240, () => new MACD({ short: 12, long: 26, signal: 9 }));

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];

    if (i >= candles.length - EXTENDED) {
      // only for pct change, not needed
      candle.ind = {};
      continue;
    }

    const bigCandle10 = waveManager10.update(candle);
    const bigCandle30 = waveManager30.update(candle);
    const bigCandle60 = waveManager60.update(candle);
    const bigCandle120 = waveManager120.update(candle);
    const bigCandle240 = waveManager240.update(candle);
    const bigCandle480 = waveManager480.update(candle);

    if (!bigCandle10 || !bigCandle30 || !bigCandle60 || !bigCandle120 || !bigCandle240 || !bigCandle480) {
      candle.ind = {};
      continue;
    }

    candle.ind = {
      rsi30x10: rsi30x10.update(bigCandle30),
      rsi30x20: rsi30x20.update(bigCandle30),
      rsi30x30: rsi30x30.update(bigCandle30),
      rsi60x10: rsi60x10.update(bigCandle60),
      rsi60x20: rsi60x20.update(bigCandle60),
      rsi60x30: rsi60x30.update(bigCandle60),
      rsi120x10: rsi120x10.update(bigCandle120),
      rsi120x20: rsi120x20.update(bigCandle120),
      rsi120x30: rsi120x30.update(bigCandle120),
      rsi240x10: rsi240x10.update(bigCandle240),
      rsi240x20: rsi240x20.update(bigCandle240),
      rsi240x30: rsi240x30.update(bigCandle240),
      rsi480x10: rsi480x10.update(bigCandle480),
      rsi480x20: rsi480x20.update(bigCandle480),
      rsi480x30: rsi480x30.update(bigCandle480),

      macd30: macd30.update(bigCandle30.close),
      macd60: macd60.update(bigCandle60.close),
      macd120: macd120.update(bigCandle120.close),
      macd240: macd240.update(bigCandle240.close),

      bbands60_10_1: bbands60_10_1.update(bigCandle60.close),
      bbands60_10_2: bbands60_10_2.update(bigCandle60.close),
      bbands60_10_3: bbands60_10_3.update(bigCandle60.close),

      bbands60_20_1: bbands60_20_1.update(bigCandle60.close),
      bbands60_20_2: bbands60_20_2.update(bigCandle60.close),
      bbands60_20_3: bbands60_20_3.update(bigCandle60.close),

      bbands60_30_1: bbands60_30_1.update(bigCandle60.close),
      bbands60_30_2: bbands60_30_2.update(bigCandle60.close),
      bbands60_30_3: bbands60_30_3.update(bigCandle60.close),

      bbands120_10_1: bbands120_10_1.update(bigCandle120.close),
      bbands120_10_2: bbands120_10_2.update(bigCandle120.close),
      bbands120_10_3: bbands120_10_3.update(bigCandle120.close),

      bbands120_20_1: bbands120_20_1.update(bigCandle120.close),
      bbands120_20_2: bbands120_20_2.update(bigCandle120.close),
      bbands120_20_3: bbands120_20_3.update(bigCandle120.close),

      bbands120_30_1: bbands120_30_1.update(bigCandle120.close),
      bbands120_30_2: bbands120_30_2.update(bigCandle120.close),
      bbands120_30_3: bbands120_30_3.update(bigCandle120.close)
    };

    candle.pctChange60m = getCandlePctChange(candles, i + 60, i);

    candle.pctChange = {
      trippleBarrier: trippleBarrier(candles, i, -2, 2, 700)
    };
  }

  const candlesActual = candles.filter((x, i) => !(i < WARMUP_IND || i >= candles.length - EXTENDED));

  const pctChange: PctChange = {
    _10m: candlesActual.map(x => x.pctChange._10m),
    _60m: candlesActual.map(x => x.pctChange._60m),
    _120m: candlesActual.map(x => x.pctChange._120m),
    _240m: candlesActual.map(x => x.pctChange._240m),
    _480m: candlesActual.map(x => x.pctChange._480m),
    _1d: candlesActual.map(x => x.pctChange._1d),
    _2d: candlesActual.map(x => x.pctChange._2d),
    _4d: candlesActual.map(x => x.pctChange._4d),
    _7d: candlesActual.map(x => x.pctChange._7d),
    _10d: candlesActual.map(x => x.pctChange._10d)
  };

  const corrCandles = new CorrCandles(coin, candles, candlesActual, WARMUP_IND, EXTENDED);

  return { corrCandles, pctChange };
};
