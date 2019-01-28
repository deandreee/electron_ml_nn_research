import { flatten } from "lodash";
import { FeatureSplit } from "./FeatureSplit";
import { UpperLowerValue, Candle } from "../types";
import { timeframes } from "./common";

export const indName = "Keltner";

export type GetIndValBBands = (candle: Candle, t: string, p: string) => UpperLowerValue;

export const getInd: GetIndValBBands = (candle: Candle, t: string, p: string) => {
  return candle.ind.keltner[t][p];
};

export const ps = [
  "p10_10_1",
  "p10_10_2",
  "p10_10_3",

  "p20_10_1",
  "p20_10_2",
  "p20_10_3",

  "p20_20_1",
  "p20_20_2",
  "p20_20_3",

  "p30_15_1",
  "p30_15_2",
  "p30_15_3"
];

export const getKeltner = (): FeatureSplit[] => {
  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `keltner.${tf}.${p}`,
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
