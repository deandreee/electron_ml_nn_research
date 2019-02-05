import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_T3MACD, T3MACD } from "../indicators/T3MACD";
import { getFeatureSplit, timeframes, getHistoryHrs, getHistoryDays } from "./common";

export const indName = "t3Macd";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.t3Macd[t][p as P_T3MACD].histo;
};

export const ps = T3MACD.getPS();

export const getT3MACD = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.t3Macd[t][p as P_T3MACD].histo];
  });
};
export const getT3MACD_HistoryHrs = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|hrs`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [getInd(x, t, p), ...getHistoryHrs(corrCandles, i, t, p, getInd)];
  });
};

export const getT3MACD_HistoryDays = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|days`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [getInd(x, t, p), ...getHistoryDays(corrCandles, i, t, p, getInd)];
  });
};
