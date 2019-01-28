import { FeatureSplit } from "./FeatureSplit";
import { flatten } from "lodash";
import { timeframes } from "./common";

export const getLRC = (): FeatureSplit[] => {
  const ps = ["p5", "p10", "p20", "p30", "p45", "p60"];

  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `lrc.${tf}.${p}`,
            fn: (x, i, corrCandles) => [x.ind.lrc[tf][p] - x.close]
          } as FeatureSplit
        ])
      );
    })
  );
};
