import { Candle } from "../types";
import { getPctChange } from "../utils";
import { RunConfig, BarrierLabel } from "../run/runConfig";

export const trippleBarrier = (
  candles: Candle[],
  idxCurr: number,
  stopLoss: number,
  takeProfit: number,
  lookAhead: number
) => {
  for (let i = idxCurr + 1; i < idxCurr + 1 + lookAhead; i++) {
    const pctChange = getPctChange(candles[i].close, candles[idxCurr].close);
    if (pctChange > takeProfit) {
      return 2;
    } else if (pctChange < stopLoss) {
      return 0;
    }
  }

  return 1; // no action
};

const convert10mToBatchSize = (batchSize: number, lookAhead: number) => {
  return Math.ceil(lookAhead / (batchSize / 10));
};

// sheet all these were in 10m, now we need to batchSize
export const getTrippleBarrierConfig = (runConfig: RunConfig, label: BarrierLabel) => {
  // const label = runConfig.BARRIER_LABEL; // need to pass because calcProb uses all
  const batchSize = runConfig.BATCH.batchSize;

  if (label === "PT_FIVE") {
    return { stopLoss: -0.5, takeProfit: 0.5, lookAhead: convert10mToBatchSize(batchSize, 20) };
  }

  if (label === "ONE") {
    // return { stopLoss: -1, takeProfit: 1, lookAhead: convert10mToBatchSize(50) };
    // adjust for x60 candles
    return { stopLoss: -1, takeProfit: 1, lookAhead: convert10mToBatchSize(batchSize, 60) };
  }

  if (label === "TWO") {
    // return { stopLoss: -2, takeProfit: 2, lookAhead: convert10mToBatchSize(batchSize, 140) };

    // JJASON
    return { stopLoss: -2, takeProfit: 2, lookAhead: convert10mToBatchSize(batchSize, 220) };
  }

  if (label === "THREE") {
    // return { stopLoss: -3, takeProfit: 3, lookAhead: convert10mToBatchSize(batchSize, 220) };
    // return { stopLoss: -3, takeProfit: 3, lookAhead: convert10mToBatchSize(batchSize, 250) };
    // for JJASON
    return { stopLoss: -3, takeProfit: 3, lookAhead: convert10mToBatchSize(batchSize, 350) };
  }

  if (label === "FIVE") {
    // return { stopLoss: -5, takeProfit: 5, lookAhead: convert10mToBatchSize(600) };
    // for batch 60 need more not sure why
    return { stopLoss: -5, takeProfit: 5, lookAhead: convert10mToBatchSize(batchSize, 700) };
  }

  throw new Error(`getTrippleBarrierConfig: Label ${label} not found`);
};

export const doubleBarrier = (candles: Candle[], idxCurr: number, stopLoss: number, takeProfit: number) => {
  for (let i = idxCurr + 1; i < candles.length; i++) {
    const pctChange = getPctChange(candles[i].close, candles[idxCurr].close);
    if (pctChange > takeProfit) {
      return 1;
    } else if (pctChange < stopLoss) {
      return 0;
    }
  }

  // throw new Error(`No label ${idxCurr}`);

  // let's just take the last one
  const pctChange = getPctChange(candles[candles.length - 1].close, candles[idxCurr].close);
  return pctChange > 0 ? 1 : 0;
};
