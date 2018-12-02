import { FeatureSplit } from "./FeatureSplit";

// -------------------- RUNNING macd60_ADX120 --------------------
// AugSep     0.43  0.43  0.43
// Jun        0.37  0.3   0.33
// Jul        0.25  0.24  0.25
// Aug        0.45  0.45  0.45
// Sep        0.34  0.39  0.36
// Oct        0.35  0.42  0.38
// Nov        0.45  0.51  0.48

export const getMACDADX = (): FeatureSplit[] => {
  return [
    {
      name: "macd60_ADX30",
      fn: (x, i, corrCandles) => [x.ind.macd60_ADX30]
    },
    {
      name: "macd60_ADX60",
      fn: (x, i, corrCandles) => [x.ind.macd60_ADX60]
    },
    {
      name: "macd60_ADX120",
      fn: (x, i, corrCandles) => [x.ind.macd60_ADX120]
    },
    {
      name: "macd120_ADX30",
      fn: (x, i, corrCandles) => [x.ind.macd120_ADX30]
    },
    {
      name: "macd120_ADX60",
      fn: (x, i, corrCandles) => [x.ind.macd120_ADX60]
    },
    {
      name: "macd120_ADX120",
      fn: (x, i, corrCandles) => [x.ind.macd120_ADX120]
    }
  ];
};
