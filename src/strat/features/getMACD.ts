import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_MACD, MACD } from "../indicators/MACD";
import { getFeatureSplit, timeframes } from "./common";

export const indName = "macd";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.macd[t][p as P_MACD].histo;
};

export const ps = MACD.getPS();

export const getMACD = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.macd[t][p as P_MACD].histo];
  });
};
