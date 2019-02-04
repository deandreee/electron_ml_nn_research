import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_RSI, RSI } from "../indicators/RSI";
import { getFeatureSplit, timeframes, getHistoryHrs, getHistoryDays } from "./common";

export const indName = "rsi";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.rsi[t][p as P_RSI];
};

export const ps = RSI.getPS();

export const getRSI = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.rsi[t][p as P_RSI]];
  });
};

export const getRSI_HistoryHrs = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|hrs`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [getInd(x, t, p), ...getHistoryHrs(corrCandles, i, t, p, getInd)];
  });
};

export const getRSI_HistoryDays = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|days`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [getInd(x, t, p), ...getHistoryDays(corrCandles, i, t, p, getInd)];
  });
};
