import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { getFeatureSplit, timeframes } from "./common";
import { VixFix, P_VixFix } from "../indicators/VixFix";

export const indName = "vixFix";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.vixFix[t][p as P_VixFix];
};

export const ps = VixFix.getPS();

export const getVixFix = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.vixFix[t][p as P_VixFix]];
  });
};

export const getVixFix_HistoryHrs = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|hrs`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [
      x.ind.vixFix[t][p as P_VixFix],
      corrCandles.getPrevHrs(i, 1).ind.vixFix[t][p as P_VixFix],
      corrCandles.getPrevHrs(i, 2).ind.vixFix[t][p as P_VixFix],
      corrCandles.getPrevHrs(i, 4).ind.vixFix[t][p as P_VixFix],
      corrCandles.getPrevHrs(i, 8).ind.vixFix[t][p as P_VixFix],
      corrCandles.getPrevHrs(i, 12).ind.vixFix[t][p as P_VixFix],
      corrCandles.getPrevHrs(i, 24).ind.vixFix[t][p as P_VixFix]
    ];
  });
};

export const getVixFix_HistoryDays = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|days`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [
      x.ind.vixFix[t][p as P_VixFix],
      corrCandles.getPrevHrs(i, 12).ind.vixFix[t][p as P_VixFix],
      corrCandles.getPrevHrs(i, 24).ind.vixFix[t][p as P_VixFix],
      corrCandles.getPrevHrs(i, 24 * 2).ind.vixFix[t][p as P_VixFix],
      corrCandles.getPrevHrs(i, 24 * 3).ind.vixFix[t][p as P_VixFix],
      corrCandles.getPrevHrs(i, 24 * 4).ind.vixFix[t][p as P_VixFix],
      corrCandles.getPrevHrs(i, 24 * 5).ind.vixFix[t][p as P_VixFix]
    ];
  });
};
