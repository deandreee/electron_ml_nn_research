import { FeatureSplit } from "./FeatureSplit";

export const getT3MACD = (): FeatureSplit[] => {
  const timeframes = ["x30", "x60", "x120", "x240", "x480"];

  return timeframes.map(
    tf =>
      ({
        name: `${tf}.t3Macd`,
        fn: (x, i, corrCandles) => [x.ind.t3Macd[tf].t3Macd.histo]
      } as FeatureSplit)
  );
};
