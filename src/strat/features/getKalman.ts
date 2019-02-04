import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { getFeatureSplit, timeframes, getHistoryHrs, getHistoryDays } from "./common";
import { Kalman, P_Kalman } from "../indicators/Kalman";

export const indName = "kalman";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.kalman[t][p as P_Kalman] - candle.close;
};

export const ps = Kalman.getPS();

export const getKalman = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.kalman[t][p as P_Kalman], x.close];
  });
};

export const getKalman_HistoryHrs = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|hrs`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [getInd(x, t, p), ...getHistoryHrs(corrCandles, i, t, p, getInd)];
  });
};

export const getKalman_HistoryDays = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|days`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [getInd(x, t, p), ...getHistoryDays(corrCandles, i, t, p, getInd)];
  });
};
