import { pad } from "lodash";

import { CoinData } from "../types";
import { CorrCandles } from "./CorrCandles";
import { trippleBarrier, getTrippleBarrierConfig } from "./barrier";

import { IndTimeframeGroup } from "../indicators/IndTimeframeGroup";
import * as corrUtils from "./utils";

import { EMAxOCC } from "../indicators/EMAxOCC";
import { VixFix } from "../indicators/VixFix";
import { BBands } from "../indicators/BBands";
import { Keltner } from "../indicators/Keltner";
import { ChandelierExit } from "../indicators/ChandelierExit";
import { KST } from "../indicators/KST";
import { FeatureSplit } from "../features";
import * as waveUtils from "./waveUtils";

export const CANDLE_SIZE = 10;
export const WARMUP_IND = 480 * 70; // => ind ready
export const EXTENDED = 1500 * 10; // => for pct change, not sure why 10
export const WARMUP_IND_COUNT = WARMUP_IND / CANDLE_SIZE;
export const EXTENDED_COUNT = EXTENDED / CANDLE_SIZE;

export const corrCalcBatchedProb = (coin: CoinData, featuresSplit: FeatureSplit[]) => {
  const candles = coin.candles;

  const waveManagers = waveUtils.createManagers(CANDLE_SIZE);

  // @ts-ignore
  const emaOCC = new IndTimeframeGroup(EMAxOCC, waveManagers);
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
      // emaOCC: emaOCC.update(bigCandles),
      // vixFix: vixFix.update(bigCandles),
      bbands: bbands.update(bigCandles),
      // keltner: keltner.update(bigCandles),
      // chandelierExit: chandelierExit.update(bigCandles), // too slow, skip for now
      kst: kst.update(bigCandles)
    };

    const ptFive = getTrippleBarrierConfig("PT_FIVE");
    const one = getTrippleBarrierConfig("ONE");
    const two = getTrippleBarrierConfig("TWO");
    const three = getTrippleBarrierConfig("THREE");
    const five = getTrippleBarrierConfig("FIVE");

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

  const candlesActual = candles.filter((x, i) => !(i < WARMUP_IND_COUNT || i >= candles.length - EXTENDED_COUNT));
  const pctChange = corrUtils.getPctChange(candlesActual);
  const corrCandles = new CorrCandles(coin, candles, candlesActual, WARMUP_IND_COUNT, EXTENDED);

  return { corrCandles, pctChange };
};
