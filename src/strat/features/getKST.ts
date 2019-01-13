import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_KST, KST } from "../indicators/KST";
import { FnGetFeaturesInXm, getFeatureSplit, timeframes } from "./common";

export const indName = "KSI";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.kst[t][p as P_KST];
};

export const ps = KST.getPS();

const getF: FnGetFeaturesInXm = (x, i, corrCandles, t, p) => {
  return [x.ind.kst[t][p as P_KST].kst, x.ind.kst[t][p as P_KST].signal];
};

export const getKST = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, getF);
};
