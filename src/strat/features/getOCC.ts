import { FeatureSplit } from "./FeatureSplit";

export const getOCC = (): FeatureSplit[] => {
  return [
    {
      name: "emaOCC240_5",
      fn: (x, i, corrCandles) => [x.ind.emaOCC240_5]
    },

    {
      name: "emaOCC240_10",
      fn: (x, i, corrCandles) => [x.ind.emaOCC240_10]
    },

    {
      name: "emaOCC240_20",
      fn: (x, i, corrCandles) => [x.ind.emaOCC240_20]
    },

    {
      name: "emaOCC240_30",
      fn: (x, i, corrCandles) => [x.ind.emaOCC240_30]
    }
  ];
};
