import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { getFeatureSplit, timeframes } from "./common";
import { Kalman, P_Kalman } from "../indicators/Kalman";

export const indName = "kalman";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.kalman[t][p as P_Kalman];
};

export const ps = Kalman.getPS();

export const getKalman = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [
      x.ind.kalman[t][p as P_Kalman],
      corrCandles.getPrev(i, 3).ind.kalman[t][p as P_Kalman], // 30m
      corrCandles.getPrev(i, 6).ind.kalman[t][p as P_Kalman], // 1h
      corrCandles.getPrev(i, 6 * 3).ind.kalman[t][p as P_Kalman], // 3h
      corrCandles.getPrev(i, 6 * 6).ind.kalman[t][p as P_Kalman],
      corrCandles.getPrev(i, 6 * 12).ind.kalman[t][p as P_Kalman],
      corrCandles.getPrev(i, 6 * 24).ind.kalman[t][p as P_Kalman],
      corrCandles.getPrev(i, 6 * 24 * 3).ind.kalman[t][p as P_Kalman], // 3d
      x.close
    ];
  });
};

export const getKalmanDiff = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [
      x.ind.kalman[t][p as P_Kalman],
      x.ind.kalman[t][p as P_Kalman] - corrCandles.getPrev(i, 3).ind.kalman[t][p as P_Kalman], // 30m
      x.ind.kalman[t][p as P_Kalman] - corrCandles.getPrev(i, 6).ind.kalman[t][p as P_Kalman], // 1h
      x.ind.kalman[t][p as P_Kalman] - corrCandles.getPrev(i, 6 * 3).ind.kalman[t][p as P_Kalman], // 3h
      x.ind.kalman[t][p as P_Kalman] - corrCandles.getPrev(i, 6 * 6).ind.kalman[t][p as P_Kalman],
      x.ind.kalman[t][p as P_Kalman] - corrCandles.getPrev(i, 6 * 12).ind.kalman[t][p as P_Kalman],
      x.ind.kalman[t][p as P_Kalman] - corrCandles.getPrev(i, 6 * 24).ind.kalman[t][p as P_Kalman],
      x.ind.kalman[t][p as P_Kalman] - corrCandles.getPrev(i, 6 * 24 * 3).ind.kalman[t][p as P_Kalman], // 3d
      x.ind.kalman[t][p as P_Kalman] - x.close
    ];
  });
};
