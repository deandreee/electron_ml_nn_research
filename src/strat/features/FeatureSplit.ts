import { Candle } from "../types";
import { CorrCandles } from "../corr/CorrCandles";

export type FnGetFeature = (x: Candle, i: number, corrCandles: CorrCandles) => number[];

export interface FeatureSplit {
  name: string;
  fn: FnGetFeature;
}
