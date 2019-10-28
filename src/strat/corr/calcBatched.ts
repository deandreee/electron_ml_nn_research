import { CoinData } from "../types";
// import { getCandlePctChange } from "../utils";
import { CorrCandles } from "./CorrCandles";
import { trippleBarrier, getTrippleBarrierConfig, binaryBarrierUp, binaryBarrierDown } from "./barrier";
// import { IFT } from "../indicators/IFT";
// import { IFTS } from "../indicators/IFTS";
import { EMAOCC } from "../indicators/EMAOCC";
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
// import { ATR } from "../indicators/ATR";
import { VWAP } from "../indicators/VWAP";
import { WilliamsR } from "../indicators/WilliamsR";
import { PSAR } from "../indicators/PSAR";
import { Kalman } from "../indicators/Kalman";
import { ChandelierExit } from "../indicators/ChandelierExit";
import { Keltner } from "../indicators/Keltner";

import { IndTimeframeGroup } from "../indicators/IndTimeframeGroup";
import { FeatureSplit } from "../features";
import { shouldCalc, getShouldCalc } from "./utils";
import { doubleBarrier } from "./barrier";
import * as waveUtils from "./waveUtils";
import { SMA } from "../indicators/SMA";
import { RunConfig } from "../run/config/runConfig";
import { getPctChange } from "../utils";

// const { ADX } = require(`${GEKKO}/indicators`);

// const wHist = {
// resultHistory: true
// };

export const corrCalcBatched = (runConfig: RunConfig, coin: CoinData, featuresSplit: FeatureSplit[], opt: object) => {
  const candles = coin.candles;

  const waveManagers = waveUtils.createManagers(runConfig.BATCH.batchSize);

  const sma = new IndTimeframeGroup(SMA, waveManagers, getShouldCalc(featuresSplit, "sma"), opt);
  const rsi = new IndTimeframeGroup(RSI, waveManagers, getShouldCalc(featuresSplit, "rsi"), opt);
  const bbands = new IndTimeframeGroup(BBands, waveManagers, getShouldCalc(featuresSplit, "bbands"), opt);
  const mfi = new IndTimeframeGroup(MFI, waveManagers, getShouldCalc(featuresSplit, "mfi"), opt);
  // const ift = new IndTimeframeGroup(IFT, waveManagers);
  // const ifts = new IndTimeframeGroup(IFTS, waveManagers);

  // const macd60_ADX30 = new XmBase(waveManagers.x60, () => new ADX(30, wHist));
  // const macd60_ADX60 = new XmBase(waveManagers.x60, () => new ADX(60, wHist));
  // const macd60_ADX120 = new XmBase(waveManagers.x60, () => new ADX(120, wHist));

  // const macd120_ADX30 = new XmBase(waveManagers.x120, () => new ADX(30, wHist));
  // const macd120_ADX60 = new XmBase(waveManagers.x120, () => new ADX(60, wHist));
  // const macd120_ADX120 = new XmBase(waveManagers.x120, () => new ADX(120, wHist));

  const stochKD = new IndTimeframeGroup(StochKD, waveManagers, getShouldCalc(featuresSplit, "stochKD"), opt);

  const emaOCC = new IndTimeframeGroup(EMAOCC, waveManagers, getShouldCalc(featuresSplit, "emaOCC"), opt);
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

  // now x60, basically smallest available
  // const atr = new ATR(waveManagers.x10);
  // const atr = new ATR(waveManagers.x60);

  const vwap = new IndTimeframeGroup(VWAP, waveManagers, getShouldCalc(featuresSplit, "vwap"), opt);
  const williamsR = new IndTimeframeGroup(WilliamsR, waveManagers, getShouldCalc(featuresSplit, "williamsr"), opt);
  const psar = new IndTimeframeGroup(PSAR, waveManagers, getShouldCalc(featuresSplit, "psar"), opt);
  const kalman = new IndTimeframeGroup(Kalman, waveManagers, getShouldCalc(featuresSplit, "kalman"), opt);

  const chandelierExit = new IndTimeframeGroup(
    ChandelierExit,
    waveManagers,
    getShouldCalc(featuresSplit, "chandelierExit"),
    opt
  );
  const keltner = new IndTimeframeGroup(Keltner, waveManagers, getShouldCalc(featuresSplit, "keltner"), opt);

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];

    if (i >= candles.length - runConfig.BATCH.extendedCount) {
      // only for pct change, not needed
      candle.ind = {};
      continue;
    }

    const bigCandles = waveUtils.updateCandles(waveManagers, candle);
    if (!waveUtils.areCandlesReady(bigCandles, runConfig.BATCH)) {
      candle.ind = {};
      continue;
    }

    candle.ind = {
      sma: shouldCalc(featuresSplit, "sma") ? sma.update(bigCandles) : null,
      rsi: shouldCalc(featuresSplit, "rsi") ? rsi.update(bigCandles) : null,
      bbands: shouldCalc(featuresSplit, "bbands") ? bbands.update(bigCandles) : null,
      mfi: shouldCalc(featuresSplit, "mfi") ? mfi.update(bigCandles) : null,

      // disable, super slow
      // ift: ift.update(bigCandles),
      // ifts: ifts.update(bigCandles),

      stochKD: shouldCalc(featuresSplit, "stoch") ? stochKD.update(bigCandles) : null,

      // atr: shouldCalc(featuresSplit, "atr") ? atr.update(bigCandles.x10) : null,
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
      kalman: shouldCalc(featuresSplit, "kalman") ? kalman.update(bigCandles) : null,

      chandelierExit: shouldCalc(featuresSplit, "chandelierExit") ? chandelierExit.update(bigCandles) : null,
      keltner: shouldCalc(featuresSplit, "keltner") ? keltner.update(bigCandles) : null
    };

    // if (shouldCalc(featuresSplit, "macd_adx")) {
    //   candle.ind.macd60_ADX30 = macd60_ADX30.update(
    //     valueToOHLC(candle.ind.macd.x60.sig9 && candle.ind.macd.x60.sig9.histo)
    //   );
    //   candle.ind.macd60_ADX60 = macd60_ADX60.update(
    //     valueToOHLC(candle.ind.macd.x60.sig9 && candle.ind.macd.x60.sig9.histo)
    //   );
    //   candle.ind.macd60_ADX120 = macd60_ADX120.update(
    //     valueToOHLC(candle.ind.macd.x60.sig9 && candle.ind.macd.x60.sig9.histo)
    //   );

    //   candle.ind.macd120_ADX30 = macd120_ADX30.update(
    //     valueToOHLC(candle.ind.macd.x120.sig9 && candle.ind.macd.x120.sig9.histo)
    //   );
    //   candle.ind.macd120_ADX60 = macd120_ADX60.update(
    //     valueToOHLC(candle.ind.macd.x120.sig9 && candle.ind.macd.x120.sig9.histo)
    //   );
    //   candle.ind.macd120_ADX120 = macd120_ADX120.update(
    //     valueToOHLC(candle.ind.macd.x120.sig9 && candle.ind.macd.x120.sig9.histo)
    //   );
    // }

    // candle.pctChange60m = getCandlePctChange(candles, i + 60, i);

    const tbCfg = getTrippleBarrierConfig(runConfig, runConfig.BARRIER_LABEL);

    candle.pctChange = {
      double: runConfig.BARRIER_TYPE === "double" && doubleBarrier(candles, i, tbCfg),
      tripple: runConfig.BARRIER_TYPE === "tripple" && trippleBarrier(candles, i, tbCfg),
      up: runConfig.BARRIER_TYPE === "up" && binaryBarrierUp(candles, i, tbCfg),
      down: runConfig.BARRIER_TYPE === "down" && binaryBarrierDown(candles, i, tbCfg),
      _10d: runConfig.XG_OBJECTIVE.startsWith("reg:") && getPctChange(candles[i + 24 * 10].close, candles[i].close),
      _7d: runConfig.XG_OBJECTIVE.startsWith("reg:") && getPctChange(candles[i + 24 * 7].close, candles[i].close),
      _5d: runConfig.XG_OBJECTIVE.startsWith("reg:") && getPctChange(candles[i + 24 * 5].close, candles[i].close),
      _2d: runConfig.XG_OBJECTIVE.startsWith("reg:") && getPctChange(candles[i + 24 * 2].close, candles[i].close),
      _1d: runConfig.XG_OBJECTIVE.startsWith("reg:") && getPctChange(candles[i + 24 * 1].close, candles[i].close)
    };
  }

  const candlesActual = candles.filter(
    (x, i) => !(i < runConfig.BATCH.warmupIndCount || i >= candles.length - runConfig.BATCH.extendedCount)
  );

  const corrCandles = new CorrCandles(coin, candles, candlesActual, runConfig.BATCH);

  return { corrCandles };
};
