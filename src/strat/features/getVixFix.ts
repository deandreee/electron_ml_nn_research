import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { getFeatureSplit, timeframes } from "./common";
import { VixFix, P_VixFix } from "../indicators/VixFix";

export const indName = "vixFix";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.vixFix[t][p as P_VixFix];
};

export const ps = VixFix.getPS();

export const getVixFix = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.vixFix[t][p as P_VixFix]];
  });
};
