import { flatten } from "lodash";
import { FeatureSplit } from "./FeatureSplit";

export const getRSI = (): FeatureSplit[] => {
  const timeframes = ["x30", "x60", "x120", "x240", "x480"];
  const ps = ["p5", "p10", "p15", "p20", "p30"];

  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `${tf}.rsi.${p}`,
            fn: (x, i, corrCandles) => [x.ind.rsi[tf][p]]
          } as FeatureSplit
        ])
      );
    })
  );
};
