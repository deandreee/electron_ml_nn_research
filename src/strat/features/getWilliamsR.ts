import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_WilliamsR, WilliamsR } from "../indicators/WilliamsR";
import { getFeatureSplit, timeframes } from "./common";

export const indName = "williamsr";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.williamsR[t][p as P_WilliamsR];
};

export const ps = WilliamsR.getPS();

export const getWilliamsR = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.williamsR[t][p as P_WilliamsR]];
  });
};
