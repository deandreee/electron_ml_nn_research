import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_KST, KST } from "../indicators/KST";
import { getFeatureSplit, timeframes } from "./common";

export const indName = "KST";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.kst[t][p as P_KST];
};

export const ps = KST.getPS();

export const getKST = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.kst[t][p as P_KST].kst, x.ind.kst[t][p as P_KST].signal];
  });
};

export const getKSTandPrice = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}_and_price`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.kst[t][p as P_KST].kst, x.ind.kst[t][p as P_KST].signal, x.close];
  });
};
