import { Candle } from "../types";
import { getPctChange } from "../utils";
import { TRIPPLE_BARRIER_LABEL, TrippleBarrierLabel } from "../run/runConfigXG";

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

export const getTrippleBarrierConfig = (label?: TrippleBarrierLabel) => {
  label = label || TRIPPLE_BARRIER_LABEL;

  if (label === "PT_FIVE") {
    return { stopLoss: -0.5, takeProfit: 0.5, lookAhead: 20 };
  }

  if (label === "ONE") {
    return { stopLoss: -1, takeProfit: 1, lookAhead: 50 };
  }

  if (label === "TWO") {
    return { stopLoss: -2, takeProfit: 2, lookAhead: 140 };
  }

  if (label === "THREE") {
    return { stopLoss: -3, takeProfit: 3, lookAhead: 220 };
  }

  if (label === "FIVE") {
    return { stopLoss: -5, takeProfit: 5, lookAhead: 500 };
  }

  throw new Error(`getTrippleBarrierConfig: Label ${label} not found`);
};
