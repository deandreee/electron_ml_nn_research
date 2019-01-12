import { CoinData } from "../types";
import { CorrCandles } from "./CorrCandles";
import { trippleBarrier, getTrippleBarrierConfig } from "./trippleBarrier";

import { WaveManager, BigCandles, WaveManagers } from "../indicators/gekko";
import { IndTimeframeGroup } from "../indicators/IndTimeframeGroup";
import * as corrUtils from "./utils";

import { EMAxOCC } from "../indicators/EMAxOCC";
import { VixFix } from "../indicators/VixFix";
import { BBands } from "../indicators/BBands";

const GEKKO = "../../../../gekko-develop/strategies";
const { BatchWaveManager } = require(`${GEKKO}/utils`);

export const CANDLE_SIZE = 10;
export const WARMUP_IND = 480 * 70; // => ind ready
export const EXTENDED = 1500 * 10; // => for pct change, not sure why 10
export const WARMUP_IND_COUNT = WARMUP_IND / CANDLE_SIZE;
export const EXTENDED_COUNT = EXTENDED / CANDLE_SIZE;

export const corrCalcBatchedProb = (coin: CoinData) => {
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

  const emaOCC = new IndTimeframeGroup(EMAxOCC, waveManagers);
  const vixFix = new IndTimeframeGroup(VixFix, waveManagers);
  const bbands = new IndTimeframeGroup(BBands, waveManagers);

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
      emaOCC: emaOCC.update(bigCandles),
      vixFix: vixFix.update(bigCandles),
      bbands: bbands.update(bigCandles)
    };

    const ptFive = getTrippleBarrierConfig("PT_FIVE");
    const one = getTrippleBarrierConfig("ONE");
    const two = getTrippleBarrierConfig("TWO");
    const three = getTrippleBarrierConfig("THREE");
    const five = getTrippleBarrierConfig("FIVE");

    candle.pctChange = {
      trippleBarriers: {
        ptFive: trippleBarrier(candles, i, ptFive.stopLoss, ptFive.takeProfit, ptFive.lookAhead),
        one: trippleBarrier(candles, i, one.stopLoss, one.takeProfit, one.lookAhead),
        two: trippleBarrier(candles, i, two.stopLoss, two.takeProfit, two.lookAhead),
        three: trippleBarrier(candles, i, three.stopLoss, three.takeProfit, three.lookAhead),
        five: trippleBarrier(candles, i, five.stopLoss, five.takeProfit, five.lookAhead)
      }
    };
  }

  const candlesActual = candles.filter((x, i) => !(i < WARMUP_IND_COUNT || i >= candles.length - EXTENDED_COUNT));
  const pctChange = corrUtils.getPctChange(candlesActual);
  const corrCandles = new CorrCandles(coin, candles, candlesActual, WARMUP_IND, EXTENDED);

  return { corrCandles, pctChange };
};
