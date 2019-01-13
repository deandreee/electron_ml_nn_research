import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_VWAP, VWAP } from "../indicators/VWAP";
import { getFeatureSplit, timeframes } from "./common";

export const indName = "vwap";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.vwap[t][p as P_VWAP];
};

export const ps = VWAP.getPS();

export const getVWAP = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.vwap[t][p as P_VWAP].den, x.ind.vwap[t][p as P_VWAP].num];
  });
};
