import { Candle } from "../types";
import { CorrCandles } from "../corr/CorrCandles";

export type FnGetFeature = (x: Candle, i: number, corrCandles: CorrCandles) => number[];

export interface FeatureSplit {
  name: string;
  fn: FnGetFeature;
}

export const getCoreName = (featuresSplit: FeatureSplit[]) => {
  if (featuresSplit.length === 1) {
    return featuresSplit[0].name;
  }

  if (featuresSplit[0].name.startsWith("[c]")) {
    return "[c]";
  }

  const parts = featuresSplit[0].name.split(".");
  if (parts.length !== 3) {
    throw new Error(`getCoreName name parts not 3: ${featuresSplit[0].name}`);
  }

  return parts[0];
};
