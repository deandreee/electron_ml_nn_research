import { flatten } from "lodash";
import { FeatureSplit } from "./FeatureSplit";

export const getStochKD = (): FeatureSplit[] => {
  const timeframes = ["x30", "x60", "x120", "x240", "x480"];
  const ps = ["p10", "p14", "p20", "p30"];

  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `${tf}.stochKD.${p}`,
            fn: (x, i, corrCandles) => [x.ind.stochKD[tf][p].k - x.ind.stochKD[tf][p].d]
          } as FeatureSplit
        ])
      );
    })
  );
};
