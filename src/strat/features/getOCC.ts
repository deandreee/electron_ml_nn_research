import { FeatureSplit } from "./FeatureSplit";
import { flatten } from "lodash";
import { Candle } from "../types";
import { GetIndVal } from "./common";

export const getInd: GetIndVal = (candle: Candle, t: string, p: string) => {
  return candle.ind.emaOCC[t][p];
};

export const timeframes = ["x30", "x60", "x120", "x240", "x480"];
export const ps = ["emaOCC_5", "emaOCC_10", "emaOCC_20", "emaOCC_30", "emaOCC_40"];

export const getOCC = (): FeatureSplit[] => {
  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `${tf}.bbands.${p}`,
            fn: (x, i, corrCandles) => [x.ind.emaOCC[tf][p]]
          } as FeatureSplit
        ])
      );
    })
  );
};
