import { FeatureSplit } from "./FeatureSplit";
import { flatten } from "lodash";
import { P_MACD } from "../indicators/MACD";

export const getMACD = (): FeatureSplit[] => {
  const timeframes = ["x30", "x60", "x120", "x240", "x480"];
  const ps = ["sig5", "sig9", "sig2_10", "sig2_16"];

  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `macd.${tf}.${p}`,
            fn: (x, i, corrCandles) => [x.ind.macd[tf][p as P_MACD].histo]
          } as FeatureSplit
        ])
      );
    })
  );
};
