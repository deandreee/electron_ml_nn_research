import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_MACD, MACD } from "../indicators/MACD";
import { getFeatureSplit, timeframes, getHistoryHrs, getHistoryDays } from "./common";

export const indName = "macd";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.macd[t][p as P_MACD].histo;
};

export const ps = MACD.getPS();

export const getMACD = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.macd[t][p as P_MACD].histo];
  });
};

export const getMACD_HistoryHrs = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|hrs`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [getInd(x, t, p), ...getHistoryHrs(corrCandles, i, t, p, getInd)];
  });
};

export const getMACD_HistoryDays = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|days`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [getInd(x, t, p), ...getHistoryDays(corrCandles, i, t, p, getInd)];
  });
};
