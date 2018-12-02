import { PctChange, CoinData } from "../types";
// import { getCandlePctChange } from "../utils";
import { CorrCandles } from "./CorrCandles";
import { trippleBarrier } from "./trippleBarrier";
// @ts-ignore
const { XmBase, BatchWaveManager, valueToOHLC } = require("../../../../gekko-develop/strategies/utils");

const { MACD, RSI, BBANDS, MFI, StochKD, ADX, ATR } = require("../../../../gekko-develop/strategies/indicators");

const {
  InverseFisherTransform,
  InverseFisherTransformSmoothed
} = require("../../../../gekko-develop/strategies/indicators/ninja");

export const CANDLE_SIZE = 10;
export const WARMUP_IND = 480 * 62; // => ind ready
export const EXTENDED = 1500 * 10; // => for pct change
export const WARMUP_IND_COUNT = WARMUP_IND / CANDLE_SIZE;
export const EXTENDED_COUNT = EXTENDED / CANDLE_SIZE;

const wHist = {
  resultHistory: true
};

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

  const mfi60_15 = new XmBase(waveManager60, () => new MFI(15));
  const mfi60_30 = new XmBase(waveManager60, () => new MFI(30));
  const mfi60_60 = new XmBase(waveManager60, () => new MFI(60));

  const mfi120_15 = new XmBase(waveManager120, () => new MFI(15));
  const mfi120_30 = new XmBase(waveManager120, () => new MFI(30));
  const mfi120_60 = new XmBase(waveManager120, () => new MFI(60));

  const mfi240_15 = new XmBase(waveManager240, () => new MFI(15));
  const mfi240_30 = new XmBase(waveManager240, () => new MFI(30));
  const mfi240_60 = new XmBase(waveManager240, () => new MFI(60));

  const mfi480_15 = new XmBase(waveManager480, () => new MFI(15));
  const mfi480_30 = new XmBase(waveManager480, () => new MFI(30));
  const mfi480_60 = new XmBase(waveManager480, () => new MFI(60));

  const ift30x5 = new XmBase(waveManager30, () => new InverseFisherTransform({ period: 5 }));
  const ift60x5 = new XmBase(waveManager60, () => new InverseFisherTransform({ period: 5 }));
  const ift60x15 = new XmBase(waveManager60, () => new InverseFisherTransform({ period: 15 }));
  const ift10x15 = new XmBase(waveManager10, () => new InverseFisherTransform({ period: 15 }));
  const ift30x15 = new XmBase(waveManager30, () => new InverseFisherTransform({ period: 15 }));
  const ift120x15 = new XmBase(waveManager120, () => new InverseFisherTransform({ period: 15 }));
  const ift10x30 = new XmBase(waveManager10, () => new InverseFisherTransform({ period: 30 }));
  const ift60x30 = new XmBase(waveManager60, () => new InverseFisherTransform({ period: 30 }));
  const ift120x30 = new XmBase(waveManager120, () => new InverseFisherTransform({ period: 30 }));
  const ifts10x15 = new XmBase(waveManager10, () => new InverseFisherTransformSmoothed({ period: 15 }));
  const ifts30x15 = new XmBase(waveManager30, () => new InverseFisherTransformSmoothed({ period: 15 }));
  const ifts60x15 = new XmBase(waveManager60, () => new InverseFisherTransformSmoothed({ period: 15 }));

  const stochKD60_10 = new XmBase(waveManager60, () => new StochKD({ period: 10, signalPeriod: 3 }));
  const stochKD60_14 = new XmBase(waveManager60, () => new StochKD({ period: 14, signalPeriod: 3 }));
  const stochKD60_20 = new XmBase(waveManager60, () => new StochKD({ period: 20, signalPeriod: 3 }));
  const stochKD60_30 = new XmBase(waveManager60, () => new StochKD({ period: 30, signalPeriod: 3 }));
  const stochKD120_10 = new XmBase(waveManager120, () => new StochKD({ period: 10, signalPeriod: 3 }));
  const stochKD120_14 = new XmBase(waveManager120, () => new StochKD({ period: 14, signalPeriod: 3 }));
  const stochKD120_20 = new XmBase(waveManager120, () => new StochKD({ period: 20, signalPeriod: 3 }));
  const stochKD120_30 = new XmBase(waveManager120, () => new StochKD({ period: 30, signalPeriod: 3 }));

  const macd60_ADX30 = new ADX(30, wHist);
  const macd60_ADX60 = new ADX(60, wHist);
  const macd60_ADX120 = new ADX(120, wHist);

  const macd120_ADX30 = new ADX(30, wHist);
  const macd120_ADX60 = new ADX(60, wHist);
  const macd120_ADX120 = new ADX(120, wHist);

  const atr60 = new ATR(60);
  const atr120 = new ATR(120);
  const atr240 = new ATR(240);
  const atr360 = new ATR(360);
  const atr480 = new ATR(480);
  const atr720 = new ATR(720);
  const atr960 = new ATR(960);

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];

    if (i >= candles.length - EXTENDED_COUNT) {
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
      bbands120_30_3: bbands120_30_3.update(bigCandle120.close),

      mfi60_15: mfi60_15.update(bigCandle60),
      mfi60_30: mfi60_30.update(bigCandle60),
      mfi60_60: mfi60_60.update(bigCandle60),
      mfi120_15: mfi120_15.update(bigCandle120),
      mfi120_30: mfi120_30.update(bigCandle120),
      mfi120_60: mfi120_60.update(bigCandle120),
      mfi240_15: mfi240_15.update(bigCandle240),
      mfi240_30: mfi240_30.update(bigCandle240),
      mfi240_60: mfi240_60.update(bigCandle240),
      mfi480_15: mfi480_15.update(bigCandle480),
      mfi480_30: mfi480_30.update(bigCandle480),
      mfi480_60: mfi480_60.update(bigCandle480),

      ift30x5: ift30x5.update(bigCandle30),
      ift60x5: ift60x5.update(bigCandle60),
      ift60x15: ift60x15.update(bigCandle60),
      ift10x15: ift10x15.update(bigCandle10),
      ift30x15: ift30x15.update(bigCandle30),
      ift120x15: ift120x15.update(bigCandle120),
      ift10x30: ift10x30.update(bigCandle10),
      ift60x30: ift60x30.update(bigCandle60),
      ift120x30: ift120x30.update(bigCandle120),
      ifts10x15: ifts10x15.update(bigCandle10),
      ifts30x15: ifts30x15.update(bigCandle30),
      ifts60x15: ifts60x15.update(bigCandle60),

      stochKD60_10: stochKD60_10.update(bigCandle60),
      stochKD60_14: stochKD60_14.update(bigCandle60),
      stochKD60_20: stochKD60_20.update(bigCandle60),
      stochKD60_30: stochKD60_30.update(bigCandle60),
      stochKD120_10: stochKD120_10.update(bigCandle120),
      stochKD120_14: stochKD120_14.update(bigCandle120),
      stochKD120_20: stochKD120_20.update(bigCandle120),
      stochKD120_30: stochKD120_30.update(bigCandle120),

      atr60: atr60.update(candle),
      atr120: atr120.update(candle),
      atr240: atr240.update(candle),
      atr360: atr360.update(candle),
      atr480: atr480.update(candle),
      atr720: atr720.update(candle),
      atr960: atr960.update(candle)
    };

    candle.ind.macd60_ADX30 = macd60_ADX30.update(valueToOHLC(candle.ind.macd60 && candle.ind.macd60.histo));
    candle.ind.macd60_ADX60 = macd60_ADX60.update(valueToOHLC(candle.ind.macd60 && candle.ind.macd60.histo));
    candle.ind.macd60_ADX120 = macd60_ADX120.update(valueToOHLC(candle.ind.macd60 && candle.ind.macd60.histo));

    candle.ind.macd120_ADX30 = macd120_ADX30.update(valueToOHLC(candle.ind.macd120 && candle.ind.macd120.histo));
    candle.ind.macd120_ADX60 = macd120_ADX60.update(valueToOHLC(candle.ind.macd120 && candle.ind.macd120.histo));
    candle.ind.macd120_ADX120 = macd120_ADX120.update(valueToOHLC(candle.ind.macd120 && candle.ind.macd120.histo));

    // candle.pctChange60m = getCandlePctChange(candles, i + 60, i);

    candle.pctChange = {
      trippleBarrier: trippleBarrier(candles, i, -2, 2, 140)
      // trippleBarrier: trippleBarrier(candles, i, -1, 1, 50) // ok
      // trippleBarrier: trippleBarrier(candles, i, -3, 3, 220) // also works
    };
  }

  const candlesActual = candles.filter((x, i) => !(i < WARMUP_IND_COUNT || i >= candles.length - EXTENDED_COUNT));

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
