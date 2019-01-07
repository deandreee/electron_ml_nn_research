import { Candle } from "../types";
import { getPctChange } from "../utils";
import { TRIPPLE_BARRIER_LABEL } from "../run/runConfigXG";

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

export const getTrippleBarrierConfig = () => {
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
