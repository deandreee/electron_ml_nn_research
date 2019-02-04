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
  return getFeatureSplit(`${indName}|price`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [
      x.ind.emaOCC[t][p as P_EMAOCC].diff,
      x.ind.emaOCC[t][p as P_EMAOCC].open,
      x.ind.emaOCC[t][p as P_EMAOCC].close,
      x.close
    ];
  });
};

export const getEMAOCC_HistoryHrs = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|hrs`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [
      x.ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrevHrs(i, 1).ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrevHrs(i, 2).ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrevHrs(i, 4).ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrevHrs(i, 8).ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrevHrs(i, 12).ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrevHrs(i, 24).ind.emaOCC[t][p as P_EMAOCC].diff
    ];
  });
};

export const getEMAOCC_HistoryDays = (): FeatureSplit[] => {
  return getFeatureSplit(`${indName}|days`, timeframes, ps, (x, i, corrCandles, t, p) => {
    return [
      x.ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrevHrs(i, 12).ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrevHrs(i, 24).ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrevHrs(i, 24 * 2).ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrevHrs(i, 24 * 3).ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrevHrs(i, 24 * 4).ind.emaOCC[t][p as P_EMAOCC].diff,
      corrCandles.getPrevHrs(i, 24 * 5).ind.emaOCC[t][p as P_EMAOCC].diff
    ];
  });
};
