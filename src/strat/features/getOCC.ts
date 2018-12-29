import { FeatureSplit } from "./FeatureSplit";

export const getOCC = (): FeatureSplit[] => {
  return [
    {
      name: "x120.emaOCC_5",
      fn: (x, i, corrCandles) => [x.ind.emaOCC.x120.emaOCC_5]
    },

    {
      name: "x120.emaOCC_10",
      fn: (x, i, corrCandles) => [x.ind.emaOCC.x120.emaOCC_10]
    },
    {
      name: "x120.emaOCC_20",
      fn: (x, i, corrCandles) => [x.ind.emaOCC.x120.emaOCC_20]
    },

    {
      name: "x120.emaOCC_30",
      fn: (x, i, corrCandles) => [x.ind.emaOCC.x120.emaOCC_30]
    },

    {
      name: "x240.emaOCC_5",
      fn: (x, i, corrCandles) => [x.ind.emaOCC.x240.emaOCC_5]
    },

    {
      name: "x240.emaOCC_10",
      fn: (x, i, corrCandles) => [x.ind.emaOCC.x240.emaOCC_10]
    },
    {
      name: "x240.emaOCC_20",
      fn: (x, i, corrCandles) => [x.ind.emaOCC.x240.emaOCC_20]
    },

    {
      name: "x240.emaOCC_30",
      fn: (x, i, corrCandles) => [x.ind.emaOCC.x240.emaOCC_30]
    },

    {
      name: "x480.emaOCC_5",
      fn: (x, i, corrCandles) => [x.ind.emaOCC.x480.emaOCC_5]
    },

    {
      name: "x480.emaOCC_10",
      fn: (x, i, corrCandles) => [x.ind.emaOCC.x480.emaOCC_10]
    },
    {
      name: "x480.emaOCC_20",
      fn: (x, i, corrCandles) => [x.ind.emaOCC.x480.emaOCC_20]
    },

    {
      name: "x480.emaOCC_30",
      fn: (x, i, corrCandles) => [x.ind.emaOCC.x480.emaOCC_30]
    }
  ];
};
