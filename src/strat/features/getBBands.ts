import { FeatureSplit } from "./FeatureSplit";
import { Candle, UpperLowerValue } from "../types";
import { getFeatureSplit, timeframes } from "./common";
import { BBands, P_BBands } from "../indicators/BBands";

export const indName = "bbands";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.bbands[t][p as P_BBands];
};

export const ps = BBands.getPS();

export const getBBands = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.bbands[t][p as P_BBands].upper, x.ind.bbands[t][p as P_BBands].lower];
  });
};

export const getBBandsUpperLower = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|uper_lower`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [getUpperMinusLower(x.ind.bbands[t][p as P_BBands])];
  });
};

export const getBBandsVsPrice = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|vs_price`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return getVsPrice(x.ind.bbands[t][p as P_BBands], x.close);
  });
};

export const getBBandsAndPrice = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|and_price`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.bbands[t][p as P_BBands].upper, x.ind.bbands[t][p as P_BBands].lower, x.close];
  });
};

export const getUpperMinusLower = (value: UpperLowerValue) => {
  return value.upper - value.lower;
};

export const getVsPrice = (value: UpperLowerValue, close: number) => {
  return [value.upper - close, close - value.lower];
};
