import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_ZerolagT3, ZerolagT3 } from "../indicators/ZerolagT3";
import { getFeatureSplit, timeframes } from "./common";

export const indName = "zerolagT3";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.zerolagT3[t][p as P_ZerolagT3];
};

export const ps = ZerolagT3.getPS();

export const getZerolagT3 = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.zerolagT3[t][p as P_ZerolagT3]];
  });
};
