import { FeatureSplit } from "./FeatureSplit";

export const getMFI = (): FeatureSplit[] => {
  return [
    {
      name: "mfi60_15",
      fn: (x, i, corrCandles) => [x.ind.mfi60_15]
    },
    {
      name: "mfi60_30",
      fn: (x, i, corrCandles) => [x.ind.mfi60_30]
    },
    {
      name: "mfi60_60",
      fn: (x, i, corrCandles) => [x.ind.mfi60_60]
    },
    {
      name: "mfi120_15",
      fn: (x, i, corrCandles) => [x.ind.mfi120_15]
    },
    {
      name: "mfi120_30",
      fn: (x, i, corrCandles) => [x.ind.mfi120_30]
    },
    {
      name: "mfi120_60",
      fn: (x, i, corrCandles) => [x.ind.mfi120_60]
    },
    {
      name: "mfi240_15",
      fn: (x, i, corrCandles) => [x.ind.mfi240_15]
    },
    {
      name: "mfi240_30",
      fn: (x, i, corrCandles) => [x.ind.mfi240_30]
    },
    {
      name: "mfi240_60",
      fn: (x, i, corrCandles) => [x.ind.mfi240_60]
    },
    {
      name: "mfi480_15",
      fn: (x, i, corrCandles) => [x.ind.mfi480_15]
    },
    {
      name: "mfi480_30",
      fn: (x, i, corrCandles) => [x.ind.mfi480_30]
    },
    {
      name: "mfi480_60",
      fn: (x, i, corrCandles) => [x.ind.mfi480_60]
    }
  ];
};
