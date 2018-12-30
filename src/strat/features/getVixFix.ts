import { flatten } from "lodash";
import { FeatureSplit } from "./FeatureSplit";

export const getVixFix = (): FeatureSplit[] => {
  const timeframes = ["x30", "x60", "x120", "x240", "x480"];
  const ps = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `${tf}.vixFix.${p}`,
            fn: (x, i, corrCandles) => [x.ind.vixFix[tf][p]]
          } as FeatureSplit
        ])
      );
    })
  );
};
