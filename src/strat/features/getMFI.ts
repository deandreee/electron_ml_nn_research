import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_MFI, MFI } from "../indicators/MFI";
import { getFeatureSplit, timeframes } from "./common";

export const indName = "mfi";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.mfi[t][p as P_MFI];
};

export const ps = MFI.getPS();

export const getMFI = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.mfi[t][p as P_MFI]];
  });
};
