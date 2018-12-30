import { FeatureSplit } from "./FeatureSplit";
import { flatten } from "lodash";

export const getMACD = (): FeatureSplit[] => {
  const timeframes = ["x30", "x60", "x120", "x240", "x480"];
  const ps = ["sig5", "sig9", "sig2_10", "sig2_16"];

  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `${tf}.macd.${p}`,
            fn: (x, i, corrCandles) => [x.ind.macd[tf][p].histo]
          } as FeatureSplit
        ])
      );
    })
  );
};
