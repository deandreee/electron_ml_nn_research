import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_RSI, RSI } from "../indicators/RSI";
import { getFeatureSplit, timeframes } from "./common";

export const indName = "rsi";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.rsi[t][p as P_RSI];
};

export const ps = RSI.getPS();

export const getRSI = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.rsi[t][p as P_RSI]];
  });
};
