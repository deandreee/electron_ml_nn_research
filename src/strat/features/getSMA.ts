import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_SMA, SMA } from "../indicators/SMA";
import { getFeatureSplit, timeframes } from "./common";

export const indName = "sma";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.sma[t][p as P_SMA];
};

export const ps = SMA.getPS();

export const getSMA = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.sma[t][p as P_SMA]];
  });
};
