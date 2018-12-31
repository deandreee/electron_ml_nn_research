import { flatten } from "lodash";
import { FeatureSplit } from "./FeatureSplit";

export const getBBands = (): FeatureSplit[] => {
  const timeframes = ["x30", "x60", "x120", "x240", "x480"];
  const ps = [
    "p10_dev1",
    "p10_dev2",
    "p10_dev3",
    "p20_dev1",
    "p20_dev2",
    "p20_dev3",
    "p30_dev1",
    "p30_dev2",
    "p30_dev3"
  ];

  return flatten(
    timeframes.map(tf => {
      return flatten(
        ps.map(p => [
          {
            name: `${tf}.bbands.${p}`,
            fn: (x, i, corrCandles) => [x.ind.bbands[tf][p].upper - x.ind.bbands[tf][p].lower]
          } as FeatureSplit
        ])
      );
    })
  );
};
