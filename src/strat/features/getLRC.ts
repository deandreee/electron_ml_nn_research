import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_LRC, LRC } from "../indicators/LRC";
import { getFeatureSplit, timeframes, getHistoryHrs, getHistoryDays } from "./common";

export const indName = "lrc";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.lrc[t][p as P_LRC] - candle.close;
};

export const ps = LRC.getPS();

export const getLRC = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [getInd(x, t, p)];
  });
};

export const getLRC_HistoryHrs = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|hrs`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [getInd(x, t, p), ...getHistoryHrs(corrCandles, i, t, p, getInd)];
  });
};

export const getLRC_HistoryDays = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|days`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [getInd(x, t, p), ...getHistoryDays(corrCandles, i, t, p, getInd)];
  });
};
