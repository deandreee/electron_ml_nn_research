import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_PSAR, PSAR } from "../indicators/PSAR";
import { getFeatureSplit, timeframes } from "./common";

export const indName = "psar";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.psar[p as P_PSAR];
};

export const ps = PSAR.getPS();

export const getPSAR = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    const psar = x.ind.psar[t][p as P_PSAR];
    return [psar.result, encodeTrend(psar.trend), psar.trendLength];
  });
};

const encodeTrend = (trend: string) => {
  return trend === "up" ? 1 : -1;
};
