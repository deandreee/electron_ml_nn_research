import { FeatureSplit } from "./FeatureSplit";
import { flatten } from "lodash";

export const getZerolagT3 = (): FeatureSplit[] => {
  const timeframes = ["x30", "x60", "x120", "x240", "x480"];

  return flatten(
    timeframes.map(tf => [
      {
        name: `${tf}.zerolagT3.p5`,
        fn: (x, i, corrCandles) => [x.ind.zerolagT3[tf].p5 - x.close]
      } as FeatureSplit,
      {
        name: `${tf}.zerolagT3.p10`,
        fn: (x, i, corrCandles) => [x.ind.zerolagT3[tf].p10 - x.close]
      } as FeatureSplit,

      {
        name: `${tf}.zerolagT3.p30`,
        fn: (x, i, corrCandles) => [x.ind.zerolagT3[tf].p30 - x.close]
      } as FeatureSplit,

      {
        name: `${tf}.zerolagT3.p60`,
        fn: (x, i, corrCandles) => [x.ind.zerolagT3[tf].p60 - x.close]
      } as FeatureSplit
    ])
  );
};
