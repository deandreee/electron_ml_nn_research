import { FeatureSplit } from "./FeatureSplit";
import { flatten } from "lodash";

export const getLRC = (): FeatureSplit[] => {
  const timeframes = ["x30", "x60", "x120", "x240", "x480"];
  const ps = ["p5", "p10", "p20", "p30", "p45", "p60"];

  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `${tf}.lrc.${p}`,
            fn: (x, i, corrCandles) => [x.ind.lrc[tf][p] - x.close]
          } as FeatureSplit
        ])
      );
    })
  );
};
