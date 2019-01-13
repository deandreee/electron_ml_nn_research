import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_ATR, ATR } from "../indicators/ATR";
import { getFeatureSplitPsOnly } from "./common";

export const indName = "ATR";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.atr[p as P_ATR];
};

export const ps = ATR.getPS();

export const getATR = (): FeatureSplit[] => {
  return getFeatureSplitPsOnly(indName, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.atr[p as P_ATR], x.ind.atr[p as P_ATR]];
  });
};
