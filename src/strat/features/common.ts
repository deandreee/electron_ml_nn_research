import { Candle } from "../types";
import { flatten } from "lodash";
import { FeatureSplit } from ".";
import { CorrCandles } from "../corr/CorrCandles";

export type GetIndVal = (candle: Candle, t: string, p: string) => number;

export type FnGetFeaturesInXm = (x: Candle, i: number, corrCandles: CorrCandles, t: string, p: string) => number[];

export const timeframes = ["x30", "x60", "x120", "x240", "x480"];

export const getFeatureSplit = (
  name: string,
  timeframes: string[],
  ps: string[],
  fn: FnGetFeaturesInXm
): FeatureSplit[] => {
  return flatten(
    timeframes.map(t => {
      return flatten(
        ps.map(p => [
          {
            name: `${name}.${t}.${p}`,
            fn: (x, i, corrCandles) => fn(x, i, corrCandles, t, p)
          } as FeatureSplit
        ])
      );
    })
  );
};

export const getFeatureSplitPsOnly = (name: string, ps: string[], fn: FnGetFeaturesInXm): FeatureSplit[] => {
  return getFeatureSplit(name, [""], ps, fn);
};
