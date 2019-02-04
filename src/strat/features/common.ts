import { Candle } from "../types";
import { flatten } from "lodash";
import { FeatureSplit } from ".";
import { CorrCandles } from "../corr/CorrCandles";

export type GetIndVal = (candle: Candle, t: string, p: string) => number;

export type FnGetFeaturesInXm = (x: Candle, i: number, corrCandles: CorrCandles, t: string, p: string) => number[];

export type TimeFrame = "x10" | "x30" | "x60" | "x120" | "x240" | "x480" | "x1440";
export const timeframes: TimeFrame[] = ["x60", "x120", "x240", "x480", "x1440"];
// export const timeframes: TimeFrame[] = ["x60"];

export const getFeatureSplit = (
  name: string,
  timeframes: string[],
  ps: string[],
  fn: FnGetFeaturesInXm
): FeatureSplit[] => {
  const parts = name.split("|");
  const partEnding = parts[1] ? `.${parts[1]}` : "";

  return flatten(
    timeframes.map(t => {
      return flatten(
        ps.map(p => [
          {
            name: `${parts[0]}.${t}.${p}${partEnding}`,
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

export const getHistoryHrs = (
  corrCandles: CorrCandles,
  i: number,
  t: string,
  p: string,
  getInd: GetIndVal
): number[] => {
  return [
    getInd(corrCandles.getPrevHrs(i, 1), t, p),
    getInd(corrCandles.getPrevHrs(i, 2), t, p),
    getInd(corrCandles.getPrevHrs(i, 4), t, p),
    getInd(corrCandles.getPrevHrs(i, 8), t, p),
    getInd(corrCandles.getPrevHrs(i, 12), t, p),
    getInd(corrCandles.getPrevHrs(i, 24), t, p)
  ];
};

export const getHistoryDays = (
  corrCandles: CorrCandles,
  i: number,
  t: string,
  p: string,
  getInd: GetIndVal
): number[] => {
  return [
    getInd(corrCandles.getPrevHrs(i, 12), t, p),
    getInd(corrCandles.getPrevHrs(i, 24), t, p),
    getInd(corrCandles.getPrevHrs(i, 24 * 2), t, p),
    getInd(corrCandles.getPrevHrs(i, 24 * 3), t, p),
    getInd(corrCandles.getPrevHrs(i, 24 * 4), t, p),
    getInd(corrCandles.getPrevHrs(i, 24 * 5), t, p)
  ];
};
