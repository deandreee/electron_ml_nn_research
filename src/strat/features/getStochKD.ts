import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_StochKD, StochKD } from "../indicators/StochKD";
import { getFeatureSplit, timeframes } from "./common";

export const indName = "stochKD";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.stochKD[t][p as P_StochKD].k;
};

export const ps = StochKD.getPS();

export const getStochKD = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.stochKD[t][p as P_StochKD].k, x.ind.stochKD[t][p as P_StochKD].d];
  });
};
