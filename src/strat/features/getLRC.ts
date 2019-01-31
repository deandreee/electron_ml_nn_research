import { FeatureSplit } from "./FeatureSplit";
import { flatten } from "lodash";
import { timeframes } from "./common";

export const getLRC = (): FeatureSplit[] => {
  const ps = ["p5", "p10", "p20", "p30", "p45", "p60"];

  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `lrc.${tf}.${p}`,
            fn: (x, i, corrCandles) => [x.ind.lrc[tf][p] - x.close]
          } as FeatureSplit
        ])
      );
    })
  );
};

export const getLRC_HistoryHrs = (): FeatureSplit[] => {
  const ps = ["p5", "p10", "p20", "p30", "p45", "p60"];

  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `lrc.${tf}.${p}`,
            fn: (x, i, corrCandles) => {
              return [
                x.ind.lrc[tf][p] - x.close,
                corrCandles.getPrev(i, 1).ind.lrc[tf][p] - x.close,
                corrCandles.getPrev(i, 2).ind.lrc[tf][p] - x.close,
                corrCandles.getPrev(i, 4).ind.lrc[tf][p] - x.close,
                corrCandles.getPrev(i, 8).ind.lrc[tf][p] - x.close,
                corrCandles.getPrev(i, 12).ind.lrc[tf][p] - x.close
              ];
            }
          } as FeatureSplit
        ])
      );
    })
  );
};

export const getLRC_HistoryDays = (): FeatureSplit[] => {
  const ps = ["p5", "p10", "p20", "p30", "p45", "p60"];

  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `lrc.${tf}.${p}`,
            fn: (x, i, corrCandles) => {
              return [
                x.ind.lrc[tf][p] - x.close,
                corrCandles.getPrev(i, 1).ind.lrc[tf][p] - x.close,
                corrCandles.getPrev(i, 12).ind.lrc[tf][p] - x.close,
                corrCandles.getPrev(i, 24).ind.lrc[tf][p] - x.close,
                corrCandles.getPrev(i, 24 * 2).ind.lrc[tf][p] - x.close,
                corrCandles.getPrev(i, 24 ^ 3).ind.lrc[tf][p] - x.close
              ];
            }
          } as FeatureSplit
        ])
      );
    })
  );
};
