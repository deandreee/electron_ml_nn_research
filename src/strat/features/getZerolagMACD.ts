import { FeatureSplit } from "./FeatureSplit";
import { flatten } from "lodash";
import { timeframes } from "./common";

export const getZerolagMACD = (): FeatureSplit[] => {
  const ps = ["sig5", "sig9", "sig2_10", "sig2_16"];

  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `zerolagMACD.${tf}.${p}`,
            fn: (x, i, corrCandles) => [x.ind.zerolagMACD[tf][p].histo]
          } as FeatureSplit
        ])
      );
    })
  );
};
