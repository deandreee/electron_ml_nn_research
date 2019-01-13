import { PctChange, CoinData } from "../types";
// import { getCandlePctChange } from "../utils";
import { CorrCandles } from "./CorrCandles";
import { trippleBarrier, getTrippleBarrierConfig } from "./trippleBarrier";
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
import { KST } from "../indicators/KST";
import { ATR } from "../indicators/ATR";
import { VWAP } from "../indicators/VWAP";
// import { IFT } from "../indicators/IFT";
// import { IFTS } from "../indicators/IFTS";

import { WaveManager, BigCandles, WaveManagers } from "../indicators/gekko";
import { IndTimeframeGroup } from "../indicators/IndTimeframeGroup";
import { FeatureSplit } from "../features";
import { shouldCalc } from "./utils";

const GEKKO = "../../../../gekko-develop/strategies";
// @ts-ignore
const { XmBase, BatchWaveManager, valueToOHLC } = require(`${GEKKO}/utils`);

const { ADX } = require(`${GEKKO}/indicators`);

export const CANDLE_SIZE = 10;
export const WARMUP_IND = 480 * 70; // => ind ready
export const EXTENDED = 1500 * 10; // => for pct change, not sure why 10
export const WARMUP_IND_COUNT = WARMUP_IND / CANDLE_SIZE;
export const EXTENDED_COUNT = EXTENDED / CANDLE_SIZE;

const wHist = {
  resultHistory: true
};

export const corrCalcBatched = (coin: CoinData, featuresSplit: FeatureSplit[]) => {
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

  const stochKD = new IndTimeframeGroup(StochKD, waveManagers);

  const emaOCC = new IndTimeframeGroup(EMAxOCC, waveManagers);
  const t3Macd = new IndTimeframeGroup(T3MACD, waveManagers);
  const zerolagT3 = new IndTimeframeGroup(ZerolagT3, waveManagers);
  const lrc = new IndTimeframeGroup(LRC, waveManagers);

  const macd = new IndTimeframeGroup(MACD, waveManagers);
  const zerolagMACD = new IndTimeframeGroup(ZerolagMACD, waveManagers);
  const vixFix = new IndTimeframeGroup(VixFix, waveManagers);

  const kst = new IndTimeframeGroup(KST, waveManagers);

  const atr = new ATR(waveManagers.x10);

  const vwap = new IndTimeframeGroup(VWAP, waveManagers);

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
      rsi: shouldCalc(featuresSplit, "rsi") ? rsi.update(bigCandles) : null,
      bbands: shouldCalc(featuresSplit, "bbands") ? bbands.update(bigCandles) : null,
      mfi: shouldCalc(featuresSplit, "mfi") ? mfi.update(bigCandles) : null,

      // disable, super slow
      // ift: ift.update(bigCandles),
      // ifts: ifts.update(bigCandles),

      stochKD: shouldCalc(featuresSplit, "stoch") ? stochKD.update(bigCandles) : null,

      atr: shouldCalc(featuresSplit, "atr") ? atr.update(bigCandles.x10) : null,
      vwap: shouldCalc(featuresSplit, "vwap") ? vwap.update(bigCandles) : null,

      emaOCC: shouldCalc(featuresSplit, "emaOCC") ? emaOCC.update(bigCandles) : null,
      t3Macd: shouldCalc(featuresSplit, "t3Macd") ? t3Macd.update(bigCandles) : null,
      zerolagT3: shouldCalc(featuresSplit, "zerolagT3") ? zerolagT3.update(bigCandles) : null,
      lrc: shouldCalc(featuresSplit, "lrc") ? lrc.update(bigCandles) : null,

      macd: shouldCalc(featuresSplit, "macd") ? macd.update(bigCandles) : null,
      zerolagMACD: shouldCalc(featuresSplit, "zerolagMACD") ? zerolagMACD.update(bigCandles) : null,

      vixFix: shouldCalc(featuresSplit, "vixFix") ? vixFix.update(bigCandles) : null,

      kst: shouldCalc(featuresSplit, "kst") ? kst.update(bigCandles) : null
    };

    if (shouldCalc(featuresSplit, "macd_adx")) {
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
    }

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
