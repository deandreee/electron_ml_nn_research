import { FeatureSplit } from "./FeatureSplit";

export const getATR = (): FeatureSplit[] => {
  return [
    {
      name: "atr60",
      fn: (x, i, corrCandles) => [x.ind.atr60]
    },
    {
      name: "atr120",
      fn: (x, i, corrCandles) => [x.ind.atr120]
    },
    {
      name: "atr240",
      fn: (x, i, corrCandles) => [x.ind.atr240]
    },
    {
      name: "atr360",
      fn: (x, i, corrCandles) => [x.ind.atr360]
    },
    {
      name: "atr480",
      fn: (x, i, corrCandles) => [x.ind.atr480]
    },
    {
      name: "atr720",
      fn: (x, i, corrCandles) => [x.ind.atr720]
    },
    {
      name: "atr960",
      fn: (x, i, corrCandles) => [x.ind.atr960]
    }
  ];
};
