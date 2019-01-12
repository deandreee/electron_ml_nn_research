import { flatten } from "lodash";
import { FeatureSplit } from "./FeatureSplit";
import { BBandsValue, Candle } from "../types";

export const indName = "BBands";

export const getInd = (candle: Candle, t: string, p: string) => {
  return candle.ind.bbands[t][p];
};

export const timeframes = ["x30", "x60", "x120", "x240", "x480"];
export const ps = [
  "p10_dev1",
  "p10_dev2",
  "p10_dev3",
  "p15_dev1",
  "p15_dev2",
  "p15_dev3",
  "p20_dev1",
  "p20_dev2",
  "p20_dev3",
  "p30_dev1",
  "p30_dev2",
  "p30_dev3"
];

export const getBBands = (): FeatureSplit[] => {
  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `${tf}.bbands.${p}`,
            fn: (x, i, corrCandles) => [getBBandsUpperMinusLower(x.ind.bbands[tf][p])]
          } as FeatureSplit
        ])
      );
    })
  );
};

export const getBBandsUpperMinusLower = (value: BBandsValue) => {
  return value.upper - value.lower;
};
