import { flatten } from "lodash";
import { FeatureSplit } from "./FeatureSplit";
import { UpperLowerValue, Candle } from "../types";

export const indName = "Keltner";

export type GetIndValBBands = (candle: Candle, t: string, p: string) => UpperLowerValue;

export const getInd: GetIndValBBands = (candle: Candle, t: string, p: string) => {
  return candle.ind.keltner[t][p];
};

export const timeframes = ["x30", "x60", "x120", "x240", "x480"];
export const ps = ["p20_10_1", "p20_10_2", "p20_10_3"];

export const getKeltner = (): FeatureSplit[] => {
  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `${tf}.keltner.${p}`,
            fn: (x, i, corrCandles) => [getUpperMinusLower(getInd(x, tf, p))]
          } as FeatureSplit
        ])
      );
    })
  );
};

export const getUpperMinusLower = (value: UpperLowerValue) => {
  return value.upper - value.lower;
};
