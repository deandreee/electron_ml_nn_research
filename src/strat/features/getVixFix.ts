import { flatten } from "lodash";
import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";

export const indName = "vixFix";

export const timeframes = ["x30", "x60", "x120", "x240", "x480"];
export const ps = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.vixFix[t][p];
};

export const getVixFix = (): FeatureSplit[] => {
  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `${tf}.vixFix.${p}`,
            fn: (x, i, corrCandles) => [x.ind.vixFix[tf][p]]
          } as FeatureSplit
        ])
      );
    })
  );
};
