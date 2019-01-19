import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_T3MACD, T3MACD } from "../indicators/T3MACD";
import { getFeatureSplit, timeframes } from "./common";

export const indName = "T3MACD";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.t3Macd[t][p as P_T3MACD].histo;
};

export const ps = T3MACD.getPS();

export const getT3MACD = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.t3Macd[t][p as P_T3MACD].histo];
  });
};
