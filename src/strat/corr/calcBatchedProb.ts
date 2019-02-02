import { pad } from "lodash";

import { CoinData } from "../types";
import { CorrCandles } from "./CorrCandles";
import { trippleBarrier, getTrippleBarrierConfig } from "./barrier";

import { IndTimeframeGroup } from "../indicators/IndTimeframeGroup";
import * as corrUtils from "./utils";

import { EMAOCC } from "../indicators/EMAOCC";
import { VixFix } from "../indicators/VixFix";
import { BBands } from "../indicators/BBands";
import { Keltner } from "../indicators/Keltner";
import { ChandelierExit } from "../indicators/ChandelierExit";
import { KST } from "../indicators/KST";
import { FeatureSplit } from "../features";
import * as waveUtils from "./waveUtils";
import { BatchConfig } from "./BatchConfig";

export const corrCalcBatchedProb = (batchConfig: BatchConfig, coin: CoinData, featuresSplit: FeatureSplit[]) => {
  const candles = coin.candles;

  const waveManagers = waveUtils.createManagers(batchConfig.batchSize);

  // @ts-ignore
  const emaOCC = new IndTimeframeGroup(EMAOCC, waveManagers);
  // @ts-ignore
  const vixFix = new IndTimeframeGroup(VixFix, waveManagers);
  // @ts-ignore
  const bbands = new IndTimeframeGroup(BBands, waveManagers);
  // @ts-ignore
  const keltner = new IndTimeframeGroup(Keltner, waveManagers);
  // @ts-ignore
  const chandelierExit = new IndTimeframeGroup(ChandelierExit, waveManagers);
  // @ts-ignore
  const kst = new IndTimeframeGroup(KST, waveManagers);

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];

    if (i >= candles.length - batchConfig.extendedCount) {
      // only for pct change, not needed
      candle.ind = {};
      continue;
    }

    const bigCandles = waveUtils.updateCandles(waveManagers, candle);

    if (!waveUtils.areCandlesReady(bigCandles, batchConfig)) {
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

    const ptFive = getTrippleBarrierConfig(batchConfig.batchSize, "PT_FIVE");
    const one = getTrippleBarrierConfig(batchConfig.batchSize, "ONE");
    const two = getTrippleBarrierConfig(batchConfig.batchSize, "TWO");
    const three = getTrippleBarrierConfig(batchConfig.batchSize, "THREE");
    const five = getTrippleBarrierConfig(batchConfig.batchSize, "FIVE");

    candle.pctChange = {
      trippleBarriers: {
        PT_FIVE: trippleBarrier(candles, i, ptFive.stopLoss, ptFive.takeProfit, ptFive.lookAhead),
        ONE: trippleBarrier(candles, i, one.stopLoss, one.takeProfit, one.lookAhead),
        TWO: trippleBarrier(candles, i, two.stopLoss, two.takeProfit, two.lookAhead),
        THREE: trippleBarrier(candles, i, three.stopLoss, three.takeProfit, three.lookAhead),
        FIVE: trippleBarrier(candles, i, five.stopLoss, five.takeProfit, five.lookAhead)
      }
    };

    if (i % 1000 === 0) {
      console.log(pad(` checkpoint @ ${new Date(candle.start * 1000).toDateString()} `, 85, "."));
    }
  }

  const candlesActual = candles.filter(
    (x, i) => !(i < batchConfig.warmupIndCount || i >= candles.length - batchConfig.extendedCount)
  );
  const pctChange = corrUtils.getPctChange(candlesActual);
  const corrCandles = new CorrCandles(coin, candles, candlesActual, batchConfig);

  return { corrCandles, pctChange };
};
