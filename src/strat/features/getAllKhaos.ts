import { FeatureSplit } from "./FeatureSplit";

export const getAllKhaos = (): FeatureSplit[] => {
  return [
    {
      name: "atr960 / atr120",
      fn: (x, i, corrCandles) => [x.ind.atr.p960 / x.ind.atr.p120]
    },
    {
      name: "atr960 - atr120",
      fn: (x, i, corrCandles) => [x.ind.atr.p960 - x.ind.atr.p120]
    },
    {
      name: "close - lrc60_PSAR",
      fn: (x, i, corrCandles) => [x.close - x.ind.lrc60_PSAR.result]
    },
    {
      name: "close - lrc60",
      fn: (x, i, corrCandles) => [x.close - x.ind.lrc60]
    },
    {
      name: "close - lrc120",
      fn: (x, i, corrCandles) => [x.close - x.ind.lrc120]
    },

    {
      name: "atr960",
      fn: (x, i, corrCandles) => [x.ind.atr.p960]
    },
    {
      name: "atr720",
      fn: (x, i, corrCandles) => [x.ind.atr.p720]
    },
    {
      name: "atr480",
      fn: (x, i, corrCandles) => [x.ind.atr.p480]
    },
    {
      name: "atr360",
      fn: (x, i, corrCandles) => [x.ind.atr.p360]
    },
    {
      name: "atr240",
      fn: (x, i, corrCandles) => [x.ind.atr.p240]
    },
    {
      name: "atr120",
      fn: (x, i, corrCandles) => [x.ind.atr.p120]
    },
    {
      name: "atr60",
      fn: (x, i, corrCandles) => [x.ind.atr.p60]
    },

    {
      name: "stochKD60_14.k",
      fn: (x, i, corrCandles) => [x.ind.stochKD.x60.p14.k]
    },
    {
      name: "stochKD60_14.d",
      fn: (x, i, corrCandles) => [x.ind.stochKD.x60.p14.d]
    },

    {
      name: "cci",
      fn: (x, i, corrCandles) => [x.ind.cci]
    },
    {
      name: "macdHistoLrc - slow",
      fn: (x, i, corrCandles) => [x.ind.macdHistoLrc - x.ind.macdHistoLrcSlow]
    },
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
    },
    {
      name: "macd60_PSAR",
      fn: (x, i, corrCandles) => [x.ind.macd60_PSAR.result]
    },
    {
      name: "zlema60Fast - slow",
      fn: (x, i, corrCandles) => [x.ind.zlema60Fast - x.ind.zlema60Slow]
    },
    {
      name: "close",
      fn: (x, i, corrCandles) => [x.close]
    }
  ];
};
