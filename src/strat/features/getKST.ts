import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_KST, KST } from "../indicators/KST";
import { getFeatureSplit, timeframes, getHistoryHrs, getHistoryDays } from "./common";

export const indName = "kst";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.kst[t][p as P_KST].kst;
};

export const ps = KST.getPS();

export const getKST = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.kst[t][p as P_KST].kst, x.ind.kst[t][p as P_KST].signal];
  });
};

export const getKST_Price = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|price`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.kst[t][p as P_KST].kst, x.ind.kst[t][p as P_KST].signal, x.close];
  });
};

export const getKST_HistoryHrs = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|hrs`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [getInd(x, t, p), ...getHistoryHrs(corrCandles, i, t, p, getInd)];
  });
};

export const getKST_HistoryDays = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|days`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [getInd(x, t, p), ...getHistoryDays(corrCandles, i, t, p, getInd)];
  });
};
