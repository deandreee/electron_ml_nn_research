import { flatten } from "lodash";
import { FeatureSplit } from "./FeatureSplit";

export const getIFT = (): FeatureSplit[] => {
  const timeframes = ["x30", "x60", "x120", "x240", "x480"];
  const ps = ["p5", "p10", "p15", "p20", "p30"];

  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `${tf}.ift.${p}`,
            fn: (x, i, corrCandles) => [x.ind.ift[tf][p]]
          } as FeatureSplit
        ])
      );
    })
  );
};
