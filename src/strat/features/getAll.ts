import { FeatureSplit } from "./FeatureSplit";

export const getAll = (): FeatureSplit[] => {
  return [
    { name: "macd30", fn: (x, i, corrCandles) => [x.ind.macd30.histo] },
    { name: "macd60", fn: (x, i, corrCandles) => [x.ind.macd60.histo] },
    { name: "macd120", fn: (x, i, corrCandles) => [x.ind.macd120.histo] },
    { name: "lrc10_pred", fn: (x, i, corrCandles) => [x.ind.lrc10_pred] },
    {
      name: "macd60 vs 120m",
      fn: (x, i, corrCandles) => [x.ind.macd60.histo - corrCandles.getPrev(i, 120).ind.macd60.histo]
    },
    {
      name: "macd60 vs 240m",
      fn: (x, i, corrCandles) => [x.ind.macd60.histo - corrCandles.getPrev(i, 240).ind.macd60.histo]
    },
    {
      name: "macd60 vs 480m",
      fn: (x, i, corrCandles) => [x.ind.macd60.histo - corrCandles.getPrev(i, 480).ind.macd60.histo]
    },
    {
      name: "macd60 vs 720m",
      fn: (x, i, corrCandles) => [x.ind.macd60.histo - corrCandles.getPrev(i, 720).ind.macd60.histo]
    },
    {
      name: "macd60 vs 960m",
      fn: (x, i, corrCandles) => [x.ind.macd60.histo - corrCandles.getPrev(i, 960).ind.macd60.histo]
    },
    {
      name: "macd60 vs 1500m",
      fn: (x, i, corrCandles) => [x.ind.macd60.histo - corrCandles.getPrev(i, 1500).ind.macd60.histo]
    },
    {
      name: "atr960 / atr120",
      fn: (x, i, corrCandles) => [x.ind.atr960 / x.ind.atr120]
    },
    {
      name: "atr960 - atr120",
      fn: (x, i, corrCandles) => [x.ind.atr960 - x.ind.atr120]
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
      fn: (x, i, corrCandles) => [x.ind.atr960]
    },
    {
      name: "atr720",
      fn: (x, i, corrCandles) => [x.ind.atr720]
    },
    {
      name: "atr480",
      fn: (x, i, corrCandles) => [x.ind.atr480]
    },
    {
      name: "atr360",
      fn: (x, i, corrCandles) => [x.ind.atr360]
    },
    {
      name: "atr240",
      fn: (x, i, corrCandles) => [x.ind.atr240]
    },
    {
      name: "atr120",
      fn: (x, i, corrCandles) => [x.ind.atr120]
    },
    {
      name: "atr60",
      fn: (x, i, corrCandles) => [x.ind.atr60]
    },
    {
      name: "mfi60_15",
      fn: (x, i, corrCandles) => [x.ind.mfi60_15]
    },
    {
      name: "mfi60_30",
      fn: (x, i, corrCandles) => [x.ind.mfi60_30]
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
      name: "stochKD60_14.k",
      fn: (x, i, corrCandles) => [x.ind.stochKD60_14.k]
    },
    {
      name: "stochKD60_14.d",
      fn: (x, i, corrCandles) => [x.ind.stochKD60_14.d]
    },
    // this was the mistake before, leaving just the lower, but it brought the best result... oh, because it's closest to price ...
    {
      name: "bbands60_20_2_mistake",
      fn: (x, i, corrCandles) => [x.ind.bbands60_20_2.lower]
    },
    {
      name: "bbands60_20_2",
      fn: (x, i, corrCandles) => [x.ind.bbands60_20_2.upper - x.ind.bbands60_20_2.lower]
    },
    {
      name: "rsi60x10",
      fn: (x, i, corrCandles) => [x.ind.rsi60x10]
    },
    {
      name: "rsi60x20",
      fn: (x, i, corrCandles) => [x.ind.rsi60x20]
    },
    {
      name: "rsi120x10",
      fn: (x, i, corrCandles) => [x.ind.rsi120x10]
    },
    {
      name: "zerlagMacd60",
      fn: (x, i, corrCandles) => [x.ind.zerlagMacd60.histo]
    },
    {
      name: "zerlagMacd120",
      fn: (x, i, corrCandles) => [x.ind.zerlagMacd120.histo]
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
      name: "ift60x15",
      fn: (x, i, corrCandles) => [x.ind.ift60x15]
    },
    {
      name: "ift30x15",
      fn: (x, i, corrCandles) => [x.ind.ift30x15]
    },
    {
      name: "ift120x15",
      fn: (x, i, corrCandles) => [x.ind.ift120x15]
    },
    {
      name: "close",
      fn: (x, i, corrCandles) => [x.close]
    }
  ];
};