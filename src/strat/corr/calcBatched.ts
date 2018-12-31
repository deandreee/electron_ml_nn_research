import { PctChange, CoinData } from "../types";
// import { getCandlePctChange } from "../utils";
import { CorrCandles } from "./CorrCandles";
import { trippleBarrier } from "./trippleBarrier";
import { TRIPPLE_BARRIER_LABEL } from "../run/runConfigXG";
import { EMAxOCC } from "../indicators/EMAxOCC";
import { T3MACD } from "../indicators/T3MACD";
import { ZerolagT3 } from "../indicators/ZerolagT3";
import { ZerolagMACD } from "../indicators/ZerolagMACD";
import { MACD } from "../indicators/MACD";
import { LRC } from "../indicators/LRC";
import { VixFix } from "../indicators/VixFix";
import { StochKD } from "../indicators/StochKD";
import { MFI } from "../indicators/MFI";
import { RSI } from "../indicators/RSI";
import { BBands } from "../indicators/BBands";
// import { IFT } from "../indicators/IFT";
// import { IFTS } from "../indicators/IFTS";

import { WaveManager, BigCandles, WaveManagers } from "../indicators/gekko";
import { IndTimeframeGroup } from "../indicators/IndTimeframeGroup";

const GEKKO = "../../../../gekko-develop/strategies";
// @ts-ignore
const { XmBase, BatchWaveManager, valueToOHLC } = require(`${GEKKO}/utils`);

const { ADX, ATR } = require(`${GEKKO}/indicators`);

const { VWAP } = require(`${GEKKO}/indicators/lizard`);

export const CANDLE_SIZE = 10;
export const WARMUP_IND = 480 * 70; // => ind ready
export const EXTENDED = 1500 * 10; // => for pct change, not sure why 10
export const WARMUP_IND_COUNT = WARMUP_IND / CANDLE_SIZE;
export const EXTENDED_COUNT = EXTENDED / CANDLE_SIZE;

const wHist = {
  resultHistory: true
};

const getTrippleBarrierConfig = () => {
  if (TRIPPLE_BARRIER_LABEL === "PT_FIVE") {
    return { stopLoss: -0.5, takeProfit: 0.5, lookAhead: 20 };
  }

  if (TRIPPLE_BARRIER_LABEL === "ONE") {
    return { stopLoss: -1, takeProfit: 1, lookAhead: 50 };
  }

  if (TRIPPLE_BARRIER_LABEL === "TWO") {
    return { stopLoss: -2, takeProfit: 2, lookAhead: 140 };
  }

  if (TRIPPLE_BARRIER_LABEL === "THREE") {
    return { stopLoss: -3, takeProfit: 3, lookAhead: 220 };
  }

  if (TRIPPLE_BARRIER_LABEL === "FIVE") {
    return { stopLoss: -5, takeProfit: 5, lookAhead: 500 };
  }

  throw new Error(`getTrippleBarrierConfig: Label ${TRIPPLE_BARRIER_LABEL} not found`);
};

export const corrCalcBatched = (coin: CoinData) => {
  const candles = coin.candles;

  const waveManager10 = new BatchWaveManager(10, CANDLE_SIZE) as WaveManager;
  const waveManager30 = new BatchWaveManager(30, CANDLE_SIZE) as WaveManager;
  const waveManager60 = new BatchWaveManager(60, CANDLE_SIZE) as WaveManager;
  const waveManager120 = new BatchWaveManager(120, CANDLE_SIZE) as WaveManager;
  const waveManager240 = new BatchWaveManager(240, CANDLE_SIZE) as WaveManager;
  const waveManager480 = new BatchWaveManager(480, CANDLE_SIZE) as WaveManager;

  const waveManagers: WaveManagers = {
    x10: waveManager10,
    x30: waveManager30,
    x60: waveManager60,
    x120: waveManager120,
    x240: waveManager240,
    x480: waveManager480
  };

  const rsi = new IndTimeframeGroup(RSI, waveManagers);
  const bbands = new IndTimeframeGroup(BBands, waveManagers);
  const mfi = new IndTimeframeGroup(MFI, waveManagers);
  // const ift = new IndTimeframeGroup(IFT, waveManagers);
  // const ifts = new IndTimeframeGroup(IFTS, waveManagers);

  const macd60_ADX30 = new XmBase(waveManager60, () => new ADX(30, wHist));
  const macd60_ADX60 = new XmBase(waveManager60, () => new ADX(60, wHist));
  const macd60_ADX120 = new XmBase(waveManager60, () => new ADX(120, wHist));

  const macd120_ADX30 = new XmBase(waveManager120, () => new ADX(30, wHist));
  const macd120_ADX60 = new XmBase(waveManager120, () => new ADX(60, wHist));
  const macd120_ADX120 = new XmBase(waveManager120, () => new ADX(120, wHist));

  const atr60 = new ATR(60);
  const atr120 = new ATR(120);
  const atr240 = new ATR(240);
  const atr360 = new ATR(360);
  const atr480 = new ATR(480);
  const atr720 = new ATR(720);
  const atr960 = new ATR(960);

  const vwap30_10 = new XmBase(waveManager30, () => new VWAP(10));
  const vwap30_20 = new XmBase(waveManager30, () => new VWAP(20));
  const vwap30_30 = new XmBase(waveManager30, () => new VWAP(30));

  const vwap60_10 = new XmBase(waveManager60, () => new VWAP(10));
  const vwap60_20 = new XmBase(waveManager60, () => new VWAP(20));
  const vwap60_30 = new XmBase(waveManager60, () => new VWAP(30));

  const vwap120_10 = new XmBase(waveManager120, () => new VWAP(10));
  const vwap120_20 = new XmBase(waveManager120, () => new VWAP(20));
  const vwap120_30 = new XmBase(waveManager120, () => new VWAP(30));

  const vwap240_10 = new XmBase(waveManager240, () => new VWAP(10));
  const vwap240_20 = new XmBase(waveManager240, () => new VWAP(20));
  const vwap240_30 = new XmBase(waveManager240, () => new VWAP(30));

  const stochKD = new IndTimeframeGroup(StochKD, waveManagers);

  const emaOCC = new IndTimeframeGroup(EMAxOCC, waveManagers);
  const t3Macd = new IndTimeframeGroup(T3MACD, waveManagers);
  const zerolagT3 = new IndTimeframeGroup(ZerolagT3, waveManagers);
  const lrc = new IndTimeframeGroup(LRC, waveManagers);

  const macd = new IndTimeframeGroup(MACD, waveManagers);
  const zerolagMACD = new IndTimeframeGroup(ZerolagMACD, waveManagers);
  const vixFix = new IndTimeframeGroup(VixFix, waveManagers);

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

    const bigCandles: BigCandles = {
      x10: bigCandle10,
      x30: bigCandle30,
      x60: bigCandle60,
      x120: bigCandle120,
      x240: bigCandle240,
      x480: bigCandle480
    };

    if (!bigCandle10 || !bigCandle30 || !bigCandle60 || !bigCandle120 || !bigCandle240 || !bigCandle480) {
      candle.ind = {};
      continue;
    }

    candle.ind = {
      rsi: rsi.update(bigCandles),
      bbands: bbands.update(bigCandles),
      mfi: mfi.update(bigCandles),

      // disable, super slow
      // ift: ift.update(bigCandles),
      // ifts: ifts.update(bigCandles),

      stochKD: stochKD.update(bigCandles),

      atr60: atr60.update(candle),
      atr120: atr120.update(candle),
      atr240: atr240.update(candle),
      atr360: atr360.update(candle),
      atr480: atr480.update(candle),
      atr720: atr720.update(candle),
      atr960: atr960.update(candle),

      vwap30_10: vwap30_10.update(bigCandle30),
      vwap30_20: vwap30_20.update(bigCandle30),
      vwap30_30: vwap30_30.update(bigCandle30),

      vwap60_10: vwap60_10.update(bigCandle60),
      vwap60_20: vwap60_20.update(bigCandle60),
      vwap60_30: vwap60_30.update(bigCandle60),

      vwap120_10: vwap120_10.update(bigCandle120),
      vwap120_20: vwap120_20.update(bigCandle120),
      vwap120_30: vwap120_30.update(bigCandle120),

      vwap240_10: vwap240_10.update(bigCandle240),
      vwap240_20: vwap240_20.update(bigCandle240),
      vwap240_30: vwap240_30.update(bigCandle240),

      emaOCC: emaOCC.update(bigCandles),
      t3Macd: t3Macd.update(bigCandles),
      zerolagT3: zerolagT3.update(bigCandles),
      lrc: lrc.update(bigCandles),

      macd: macd.update(bigCandles),
      zerolagMACD: zerolagMACD.update(bigCandles),

      vixFix: vixFix.update(bigCandles)
    };

    candle.ind.macd60_ADX30 = macd60_ADX30.update(
      valueToOHLC(candle.ind.macd.x60.sig9 && candle.ind.macd.x60.sig9.histo)
    );
    candle.ind.macd60_ADX60 = macd60_ADX60.update(
      valueToOHLC(candle.ind.macd.x60.sig9 && candle.ind.macd.x60.sig9.histo)
    );
    candle.ind.macd60_ADX120 = macd60_ADX120.update(
      valueToOHLC(candle.ind.macd.x60.sig9 && candle.ind.macd.x60.sig9.histo)
    );

    candle.ind.macd120_ADX30 = macd120_ADX30.update(
      valueToOHLC(candle.ind.macd.x120.sig9 && candle.ind.macd.x120.sig9.histo)
    );
    candle.ind.macd120_ADX60 = macd120_ADX60.update(
      valueToOHLC(candle.ind.macd.x120.sig9 && candle.ind.macd.x120.sig9.histo)
    );
    candle.ind.macd120_ADX120 = macd120_ADX120.update(
      valueToOHLC(candle.ind.macd.x120.sig9 && candle.ind.macd.x120.sig9.histo)
    );

    // candle.pctChange60m = getCandlePctChange(candles, i + 60, i);

    const tbCfg = getTrippleBarrierConfig();

    candle.pctChange = {
      trippleBarrier: trippleBarrier(candles, i, tbCfg.stopLoss, tbCfg.takeProfit, tbCfg.lookAhead)
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
