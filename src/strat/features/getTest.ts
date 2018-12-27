import { FeatureSplit } from "./FeatureSplit";

export const getTest = (): FeatureSplit[] => {
  return [
    {
      name: "combo_single_each",
      fn: x => [
        x.ind.rsi240x20,
        // x.ind.rsi240x30,
        // x.ind.rsi480x10,
        // x.ind.rsi480x20,
        x.ind.mfi60_15,
        x.ind.stochKD60_20.k - x.ind.stochKD60_20.d,
        // ,
        // x.ind.macd120.histo,
        // x.ind.macd240.histo,
        x.ind.macd60.histo,
        x.ind.macd60_ADX120,
        x.ind.bbands120_10_1.upper - x.ind.bbands120_10_1.lower
      ]
    }
  ];
};
