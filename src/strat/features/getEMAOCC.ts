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

export const getEMAOCC_Price = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [
      x.ind.emaOCC[t][p as P_EMAOCC].diff,
      x.ind.emaOCC[t][p as P_EMAOCC].open,
      x.ind.emaOCC[t][p as P_EMAOCC].close,
      x.close
    ];
  });
};

export const getEMAOCC_History = (): FeatureSplit[] => {
  return getFeatureSplit(indName, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [
      x.ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrev(i, 1).ind.emaOCC[t][p as P_EMAOCC].diff,
      // corrCandles.getPrev(i, 2).ind.emaOCC[t][p as P_EMAOCC].diff,
      // corrCandles.getPrev(i, 3).ind.emaOCC[t][p as P_EMAOCC].diff,
      // corrCandles.getPrev(i, 4).ind.emaOCC[t][p as P_EMAOCC].diff,
      // corrCandles.getPrev(i, 5).ind.emaOCC[t][p as P_EMAOCC].diff,
      // corrCandles.getPrev(i, 6).ind.emaOCC[t][p as P_EMAOCC].diff,
      // corrCandles.getPrev(i, 7).ind.emaOCC[t][p as P_EMAOCC].diff,
      // corrCandles.getPrev(i, 8).ind.emaOCC[t][p as P_EMAOCC].diff,
      // corrCandles.getPrev(i, 10).ind.emaOCC[t][p as P_EMAOCC].diff,
      // corrCandles.getPrev(i, 12).ind.emaOCC[t][p as P_EMAOCC].diff,
      // corrCandles.getPrev(i, 16).ind.emaOCC[t][p as P_EMAOCC].diff,
      // corrCandles.getPrev(i, 24).ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrev(i, 24 * 2).ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrev(i, 24 * 3).ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrev(i, 24 * 4).ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrev(i, 24 * 5).ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrev(i, 24 * 6).ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrev(i, 24 * 7).ind.emaOCC[t][p as P_EMAOCC].diff
    ];
  });
};
