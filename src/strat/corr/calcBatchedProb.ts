import { pad } from "lodash";

import { CoinData } from "../types";
import { CorrCandles } from "./CorrCandles";
import { trippleBarrier, getTrippleBarrierConfig } from "./barrier";

import { IndTimeframeGroup } from "../indicators/IndTimeframeGroup";
import * as corrUtils from "./utils";

import { EMAOCC } from "../indicators/EMAOCC";
import { VixFix } from "../indicators/VixFix";
import { BBands } from "../indicators/BBands";
// import { Keltner } from "../indicators/Keltner";
import { ChandelierExit } from "../indicators/ChandelierExit";
import { KST } from "../indicators/KST";
import { FeatureSplit } from "../features";
import * as waveUtils from "./waveUtils";
import { RunConfig } from "../run/config/runConfig";
// @ts-ignore
import { getShouldCalc } from "./utils";

const SHOULD_CALC_ALL = {
  x30: true,
  x60: true,
  x120: true,
  x240: true,
  x480: true,
  x1440: true
};

export const corrCalcBatchedProb = (runConfig: RunConfig, coin: CoinData, featuresSplit: FeatureSplit[]) => {
  const candles = coin.candles;

  const waveManagers = waveUtils.createManagers(runConfig.BATCH.batchSize);

  // @ts-ignore
  // const emaOCC = new IndTimeframeGroup(EMAOCC, waveManagers, getShouldCalc(featuresSplit, "emaOCC"), null);
  const emaOCC = new IndTimeframeGroup(EMAOCC, waveManagers, SHOULD_CALC_ALL, null);

  // @ts-ignore
  // const vixFix = new IndTimeframeGroup(VixFix, waveManagers, getShouldCalc(featuresSplit, "vixFix"), null);
  const vixFix = new IndTimeframeGroup(VixFix, waveManagers, SHOULD_CALC_ALL, null);

  // @ts-ignore
  // const bbands = new IndTimeframeGroup(BBands, waveManagers, getShouldCalc(featuresSplit, "bbands"), null);
  const bbands = new IndTimeframeGroup(BBands, waveManagers, SHOULD_CALC_ALL, null);

  // @ts-ignore
  // const keltner = new IndTimeframeGroup(Keltner, waveManagers, getShouldCalc(featuresSplit, "keltner"), null);
  // const keltner = new IndTimeframeGroup(Keltner, waveManagers, SHOULD_CALC_ALL, null);

  // @ts-ignore
  const chandelierExit = new IndTimeframeGroup(
    ChandelierExit,
    waveManagers,
    // getShouldCalc(featuresSplit, "chandelierExit"),
    SHOULD_CALC_ALL,
    null
  );
  // @ts-ignore
  // const kst = new IndTimeframeGroup(KST, waveManagers, getShouldCalc(featuresSplit, "kst"), null);
  const kst = new IndTimeframeGroup(KST, waveManagers, SHOULD_CALC_ALL, null);

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
      // emaOCC: emaOCC.update(bigCandles),
      // vixFix: vixFix.update(bigCandles),
      bbands: bbands.update(bigCandles),
      // keltner: keltner.update(bigCandles),
      // chandelierExit: chandelierExit.update(bigCandles), // too slow, skip for now
      kst: kst.update(bigCandles)
    };

    const ptFive = getTrippleBarrierConfig(runConfig, "PT_FIVE");
    const one = getTrippleBarrierConfig(runConfig, "ONE");
    const two = getTrippleBarrierConfig(runConfig, "TWO");
    const three = getTrippleBarrierConfig(runConfig, "THREE");
    const five = getTrippleBarrierConfig(runConfig, "FIVE");

    candle.pctChange = {
      trippleBarriers: {
        PT_FIVE: trippleBarrier(candles, i, ptFive),
        ONE: trippleBarrier(candles, i, one),
        TWO: trippleBarrier(candles, i, two),
        THREE: trippleBarrier(candles, i, three),
        FIVE: trippleBarrier(candles, i, five)
      }
    };

    if (i % 1000 === 0) {
      console.log(pad(` checkpoint @ ${new Date(candle.start * 1000).toDateString()} `, 75, "."));
    }
  }

  const candlesActual = candles.filter(
    (x, i) => !(i < runConfig.BATCH.warmupIndCount || i >= candles.length - runConfig.BATCH.extendedCount)
  );
  const pctChange = corrUtils.getPctChange(candlesActual);
  const corrCandles = new CorrCandles(coin, candles, candlesActual, runConfig.BATCH);

  return { corrCandles, pctChange };
};
