import { FeatureSplit } from "./FeatureSplit";
import { Candle, UpperLowerValue } from "../types";
import { FnGetFeaturesInXm, getFeatureSplit, timeframes } from "./common";
import { BBands, P_BBands } from "../indicators/BBands";

export const indName = "bbands";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.bbands[t][p as P_BBands];
};

export const ps = BBands.getPS();

const getF: FnGetFeaturesInXm = (x, i, corrCandles, t, p) => {
  return [x.ind.bbands[t][p as P_BBands].upper, x.ind.bbands[t][p as P_BBands].lower];
};

export const getBBands = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, getF);
};

export const getBBandsUpperMinusLower = (value: UpperLowerValue) => {
  return value.upper - value.lower;
};
