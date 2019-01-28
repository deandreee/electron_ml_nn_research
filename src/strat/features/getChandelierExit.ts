import { flatten } from "lodash";
import { FeatureSplit } from "./FeatureSplit";
import { Candle } from "../types";
import { timeframes } from "./common";

export const indName = "chandelierExit";

// export type GetIndValBBands = (candle: Candle, t: string, p: string) => UpperLowerValue;

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.chandelierExit[t][p];
};

export const ps = [
  "p5_1",
  "p5_2",
  "p5_3",

  "p10_1",
  "p10_2",
  "p10_3",

  "p15_1",
  "p15_2",
  "p15_3",

  "p20_1",
  "p20_2",
  "p20_3",

  "p25_1",
  "p25_2",
  "p25_3",

  "p30_1",
  "p30_2",
  "p30_3"
];

export const getChandelierExit = (): FeatureSplit[] => {
  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `chandelierExit.${tf}.${p}`,
            fn: (x, i, corrCandles) => [getInd(x, tf, p).exitLong, getInd(x, tf, p).exitShort]
          } as FeatureSplit
        ])
      );
    })
  );
};
