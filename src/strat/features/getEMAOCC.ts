import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { P_EMAOCC, EMAOCC } from "../indicators/EMAOCC";
import { getFeatureSplit, timeframes } from "./common";

export const indName = "emaOCC";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.emaOCC[t][p as P_EMAOCC];
};

export const ps = EMAOCC.getPS();

export const getEMAOCC = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [x.ind.emaOCC[t][p as P_EMAOCC].diff];
  });
};
