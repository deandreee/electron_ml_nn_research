import { Candle } from "../types";
import { getPctChange } from "../utils";
import { RunConfig, BarrierLabel } from "../run/runConfig";

export const trippleBarrier = (candles: Candle[], idxCurr: number, barrierCfg: BarrierConfig) => {
  for (let i = idxCurr + 1; i < idxCurr + 1 + barrierCfg.lookAhead; i++) {
    if (i > candles.length - 1) {
      const lastCandle = candles[candles.length - 1];
      throw new Error(`idx ${i} out of candles.lenght ${new Date(lastCandle.start * 1000)}`);
    }

    const pctChange = getPctChange(candles[i].close, candles[idxCurr].close);
    if (pctChange > barrierCfg.takeProfit) {
      return 2;
    } else if (pctChange < barrierCfg.stopLoss) {
      return 0;
    }
  }

  return 1; // no action
};

export const binaryBarrierUp = (candles: Candle[], idxCurr: number, barrierCfg: BarrierConfig) => {
  for (let i = idxCurr + 1; i < idxCurr + 1 + barrierCfg.lookAhead; i++) {
    if (i > candles.length - 1) {
      const lastCandle = candles[candles.length - 1];
      throw new Error(`idx ${i} out of candles.lenght ${new Date(lastCandle.start * 1000)}`);
    }

    const pctChange = getPctChange(candles[i].close, candles[idxCurr].close);
    if (pctChange > barrierCfg.takeProfit) {
      return 1;
    }

    // let's assume this as 0, because wouldn't hold anyway
    if (pctChange < barrierCfg.stopLoss) {
      return 0;
    }
  }

  return 0; // no action
};

export const binaryBarrierDown = (candles: Candle[], idxCurr: number, barrierCfg: BarrierConfig) => {
  for (let i = idxCurr + 1; i < idxCurr + 1 + barrierCfg.lookAhead; i++) {
    if (i > candles.length - 1) {
      const lastCandle = candles[candles.length - 1];
      throw new Error(`idx ${i} out of candles.lenght ${new Date(lastCandle.start * 1000)}`);
    }

    const pctChange = getPctChange(candles[i].close, candles[idxCurr].close);
    if (pctChange < barrierCfg.stopLoss) {
      return 1;
    }

    // let's assume this as 0, because wouldn't hold anyway
    if (pctChange > barrierCfg.takeProfit) {
      return 0;
    }
  }

  return 0; // no action
};

const convert10mToBatchSize = (batchSize: number, lookAhead: number) => {
  return Math.ceil(lookAhead / (batchSize / 10));
};

export interface BarrierConfig {
  takeProfit: number;
  stopLoss: number;
  lookAhead: number;
}

// sheet all these were in 10m, now we need to batchSize
export const getTrippleBarrierConfig = (runConfig: RunConfig, label: BarrierLabel): BarrierConfig => {
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
    // return { stopLoss: -2, takeProfit: 2, lookAhead: convert10mToBatchSize(batchSize, 220) };
    return { stopLoss: -2, takeProfit: 2, lookAhead: 80 };
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
    // return { stopLoss: -5, takeProfit: 5, lookAhead: convert10mToBatchSize(batchSize, 750) };

    // 60m for up/down
    return { stopLoss: -5, takeProfit: 5, lookAhead: 250 };
  }

  throw new Error(`getTrippleBarrierConfig: Label ${label} not found`);
};

export const doubleBarrier = (candles: Candle[], idxCurr: number, barrierCfg: BarrierConfig) => {
  for (let i = idxCurr + 1; i < candles.length; i++) {
    const pctChange = getPctChange(candles[i].close, candles[idxCurr].close);
    if (pctChange > barrierCfg.takeProfit) {
      return 1;
    } else if (pctChange < barrierCfg.stopLoss) {
      return 0;
    }
  }

  // throw new Error(`No label ${idxCurr}`);

  // let's just take the last one
  const pctChange = getPctChange(candles[candles.length - 1].close, candles[idxCurr].close);
  return pctChange > 0 ? 1 : 0;
};
