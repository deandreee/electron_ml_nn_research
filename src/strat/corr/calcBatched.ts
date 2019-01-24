import { PctChange, CoinData } from "../types";
// import { getCandlePctChange } from "../utils";
import { CorrCandles } from "./CorrCandles";
import { trippleBarrier, getTrippleBarrierConfig } from "./barrier";
// import { IFT } from "../indicators/IFT";
// import { IFTS } from "../indicators/IFTS";
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
import { WilliamsR } from "../indicators/WilliamsR";
import { PSAR } from "../indicators/PSAR";
import { Kalman } from "../indicators/Kalman";

import { IndTimeframeGroup } from "../indicators/IndTimeframeGroup";
import { FeatureSplit } from "../features";
import { shouldCalc, getShouldCalc } from "./utils";
import { doubleBarrier } from "./barrier";
import { BARRIER_TYPE } from "../run/runConfigXG";
import * as waveUtils from "./waveUtils";

const GEKKO = "../../../../gekko-develop/strategies";
// @ts-ignore
const { XmBase, BatchWaveManager, valueToOHLC } = require(`${GEKKO}/utils`);

const { ADX } = require(`${GEKKO}/indicators`);

export const BATCH_SIZE = 10;
export const WARMUP_IND = 480 * 100; // => ind ready | vixFix lb 90
export const EXTENDED = 1500 * 10; // => for pct change, not sure why 10
export const WARMUP_IND_COUNT = WARMUP_IND / BATCH_SIZE;
export const EXTENDED_COUNT = EXTENDED / BATCH_SIZE;

const wHist = {
  resultHistory: true
};

export const corrCalcBatched = (coin: CoinData, featuresSplit: FeatureSplit[], opt: object) => {
  const candles = coin.candles;

  const waveManagers = waveUtils.createManagers(BATCH_SIZE);

  const rsi = new IndTimeframeGroup(RSI, waveManagers, getShouldCalc(featuresSplit, "rsi"), opt);
  const bbands = new IndTimeframeGroup(BBands, waveManagers, getShouldCalc(featuresSplit, "bbands"), opt);
  const mfi = new IndTimeframeGroup(MFI, waveManagers, getShouldCalc(featuresSplit, "mfi"), opt);
  // const ift = new IndTimeframeGroup(IFT, waveManagers);
  // const ifts = new IndTimeframeGroup(IFTS, waveManagers);

  const macd60_ADX30 = new XmBase(waveManagers.x60, () => new ADX(30, wHist));
  const macd60_ADX60 = new XmBase(waveManagers.x60, () => new ADX(60, wHist));
  const macd60_ADX120 = new XmBase(waveManagers.x60, () => new ADX(120, wHist));

  const macd120_ADX30 = new XmBase(waveManagers.x120, () => new ADX(30, wHist));
  const macd120_ADX60 = new XmBase(waveManagers.x120, () => new ADX(60, wHist));
  const macd120_ADX120 = new XmBase(waveManagers.x120, () => new ADX(120, wHist));

  const stochKD = new IndTimeframeGroup(StochKD, waveManagers, getShouldCalc(featuresSplit, "stochKD"), opt);

  const emaOCC = new IndTimeframeGroup(EMAxOCC, waveManagers, getShouldCalc(featuresSplit, "emaOCC"), opt);
  const t3Macd = new IndTimeframeGroup(T3MACD, waveManagers, getShouldCalc(featuresSplit, "t3Macd"), opt);
  const zerolagT3 = new IndTimeframeGroup(ZerolagT3, waveManagers, getShouldCalc(featuresSplit, "zerolagT3"), opt);
  const lrc = new IndTimeframeGroup(LRC, waveManagers, getShouldCalc(featuresSplit, "lrc"), opt);

  const macd = new IndTimeframeGroup(MACD, waveManagers, getShouldCalc(featuresSplit, "macd"), opt);
  const zerolagMACD = new IndTimeframeGroup(
    ZerolagMACD,
    waveManagers,
    getShouldCalc(featuresSplit, "zerolagMACD"),
    opt
  );
  const vixFix = new IndTimeframeGroup(VixFix, waveManagers, getShouldCalc(featuresSplit, "vixFix"), opt);

  const kst = new IndTimeframeGroup(KST, waveManagers, getShouldCalc(featuresSplit, "kst"), opt);

  const atr = new ATR(waveManagers.x10);

  const vwap = new IndTimeframeGroup(VWAP, waveManagers, getShouldCalc(featuresSplit, "vwap"), opt);
  const williamsR = new IndTimeframeGroup(WilliamsR, waveManagers, getShouldCalc(featuresSplit, "williamsR"), opt);
  const psar = new IndTimeframeGroup(PSAR, waveManagers, getShouldCalc(featuresSplit, "psar"), opt);
  const kalman = new IndTimeframeGroup(Kalman, waveManagers, getShouldCalc(featuresSplit, "kalman"), opt);

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];

    if (i >= candles.length - EXTENDED_COUNT) {
      // only for pct change, not needed
      candle.ind = {};
      continue;
    }

    const bigCandles = waveUtils.updateCandles(waveManagers, candle);

    if (!waveUtils.areCandlesReady(bigCandles)) {
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

      kst: shouldCalc(featuresSplit, "kst") ? kst.update(bigCandles) : null,
      williamsR: shouldCalc(featuresSplit, "williamsr") ? williamsR.update(bigCandles) : null,
      psar: shouldCalc(featuresSplit, "psar") ? psar.update(bigCandles) : null,
      kalman: shouldCalc(featuresSplit, "kalman") ? kalman.update(bigCandles) : null
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
      doubleBarrier: BARRIER_TYPE === "doubleBarrier" && doubleBarrier(candles, i, tbCfg.stopLoss, tbCfg.takeProfit),
      trippleBarrier:
        BARRIER_TYPE === "trippleBarrier" &&
        trippleBarrier(candles, i, tbCfg.stopLoss, tbCfg.takeProfit, tbCfg.lookAhead)
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

  const corrCandles = new CorrCandles(coin, candles, candlesActual, WARMUP_IND_COUNT, EXTENDED_COUNT);

  return { corrCandles, pctChange };
};
