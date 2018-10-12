import { CorrCandles } from "./corrCalc";
import { Candle } from "./types";
// import * as mlUtils from "./mlUtils";

export const getBBands = (x: Candle, i: number, corrCandles: CorrCandles) => {
  const bbandsNow = x.ind.bbands.upper - x.ind.bbands.lower;
  const candlePrev = corrCandles.getPrev(i, 60);
  const bbandsPrev = candlePrev.ind.bbands.upper - candlePrev.ind.bbands.lower;

  // "-" better than "/"
  // much better
  // 60 ok 0.16 | 120 ok 0.18 | 240 ok 0.19 | 480 nok
  //
  return bbandsNow - bbandsPrev;
};

export const getFeatures = (corrCandles: CorrCandles) => {
  let features = corrCandles.candlesActual.map((x, i) => [
    getBBands(x, i, corrCandles),
    x.ind.atr960 - x.ind.atr120,
    x.ind.rsi60x10,
    x.ind.rsi60x20,
    x.ind.rsi120x10,
    x.ind.macdHistoLrc - x.ind.macdHistoLrcSlow, // 0.59
    x.ind.macd120_ADX60,
    x.ind.zlema60Fast - x.ind.zlema60Slow,
    x.ind.zerlagMacd120.histo // 0.73
  ]);

  // let features = corrCandles.candlesActual.map((x, i) => [
  //   x.ind.macd60.histo - corrCandles.getPrev(i, 1500).ind.macd60.histo
  // ]);

  // x.ind.macd60.histo - corrCandles.getPrev(i, 120).ind.macd60.histo // 0.14
  // x.ind.macd60.histo - corrCandles.getPrev(i, 240).ind.macd60.histo // 0.22
  // x.ind.macd60.histo - corrCandles.getPrev(i, 480).ind.macd60.histo // 0.25
  // x.ind.macd60.histo - corrCandles.getPrev(i, 720).ind.macd60.histo // 0.27
  // x.ind.macd60.histo - corrCandles.getPrev(i, 960).ind.macd60.histo // 0.18
  // x.ind.macd60.histo - corrCandles.getPrev(i, 1500).ind.macd60.histo // 0.24

  // something is wrong, no longer returning the same results...
  // x.ind.atr960 / x.ind.atr120 wtf 0.38
  // x.ind.atr960 - x.ind.atr120 about the same

  // x.close - x.ind.lrc60_PSAR.result
  // x.close - x.ind.lrc120

  // x.ind.atr960

  // x.ind.mfi120_60;

  // let features = candlesActual.map(x => [

  // x.ind.stochKD.k 0.17
  // x.ind.stochKD.d 0.2

  // x.ind.lrc10_pred - x.close 0.06

  //   x.ind.macd30.histo 0.22
  //   x.ind.macd60.histo 0.28
  //   x.ind.macd120.histo 0.21
  //   x.ind.bbands.upper - x.ind.bbands.lower,
  //   x.ind.atr60,
  //   // x.ind.atr240
  //   x.ind.rsi60x10,
  //   x.ind.rsi60x20,
  //   x.ind.rsi120x10,

  //   x.ind.zerlagMacd60.histo 0.14
  //   x.ind.zerlagMacd120.histo 0.21
  //   x.ind.cci,

  //   x.ind.macdHistoLrc - x.ind.macdHistoLrcSlow 0.2
  //   x.ind.macd60_ADX30 // 0.17
  //   x.ind.macd60_ADX60 // 0.22
  //   x.ind.macd60_ADX120 // 0.22

  //   x.ind.macd120_ADX30 // 0.22
  //   x.ind.macd120_ADX60 // 0.17
  //   x.ind.macd120_ADX120 // 0.2

  //   x.ind.macd60_PSAR.result 0.17
  //   x.ind.zlema60Fast - x.ind.zlema60Slow // 0.29
  //   x.ind.ift60x15
  //   x.ind.vixFix30 // 0.01

  //   x.ind.bbands.upper - x.ind.bbands.lower,
  //
  //   x.ind.ift60x15,
  //   x.ind.ift30x15,
  //   x.ind.ift120x15,
  // ]);
  // let features = candlesActual.map(x => [x.ind.ifts30x15, x.ind.ifts60x15]);

  // features.forEach(mlUtils.sanityCheckRow);

  return features;
};

export type FnGetFeature = (x: Candle, i: number, corrCandles: CorrCandles) => number;
interface FeatureSplit {
  name: string;
  fn: FnGetFeature;
}

export const getFeaturesSplitTest = (): FeatureSplit[] => {
  return [
    {
      name: "stochKD.d",
      fn: (x, i, corrCandles) => x.close - x.ind.stochKD.d
    }
    // {
    //   name: "atr960 / atr120",
    //   fn: (x, i, corrCandles) => x.ind.atr960 / x.ind.atr120
    // },
    // {
    //   name: "atr960",
    //   fn: (x, i, corrCandles) => x.close - x.ind.atr960
    // },
    // {
    //   name: "atr720",
    //   fn: (x, i, corrCandles) => x.close - x.ind.atr720
    // },
    // {
    //   name: "atr480",
    //   fn: (x, i, corrCandles) => x.close - x.ind.atr480
    // },
    // {
    //   name: "atr360",
    //   fn: (x, i, corrCandles) => x.close - x.ind.atr360
    // },
    // {
    //   name: "rsi60x10",
    //   fn: (x, i, corrCandles) => x.ind.rsi60x10
    // },
    // {
    //   name: "rsi60x20",
    //   fn: (x, i, corrCandles) => x.ind.rsi60x20
    // },
    // {
    //   name: "rsi120x10",
    //   fn: (x, i, corrCandles) => x.ind.rsi120x10
    // },
    // {
    //   name: "zerlagMacd60",
    //   fn: (x, i, corrCandles) => x.ind.zerlagMacd60.histo
    // },
    // {
    //   name: "zerlagMacd120",
    //   fn: (x, i, corrCandles) => x.ind.zerlagMacd120.histo
    // }
  ];
};

export const getFeaturesSplitAll = (): FeatureSplit[] => {
  return [
    { name: "macd30", fn: (x, i, corrCandles) => x.ind.macd30.histo },
    { name: "macd60", fn: (x, i, corrCandles) => x.ind.macd60.histo },
    { name: "macd120", fn: (x, i, corrCandles) => x.ind.macd120.histo },
    { name: "lrc10_pred", fn: (x, i, corrCandles) => x.ind.lrc10_pred },
    {
      name: "macd60 vs 120m",
      fn: (x, i, corrCandles) => x.ind.macd60.histo - corrCandles.getPrev(i, 120).ind.macd60.histo
    },
    {
      name: "macd60 vs 240m",
      fn: (x, i, corrCandles) => x.ind.macd60.histo - corrCandles.getPrev(i, 240).ind.macd60.histo
    },
    {
      name: "macd60 vs 480m",
      fn: (x, i, corrCandles) => x.ind.macd60.histo - corrCandles.getPrev(i, 480).ind.macd60.histo
    },
    {
      name: "macd60 vs 720m",
      fn: (x, i, corrCandles) => x.ind.macd60.histo - corrCandles.getPrev(i, 720).ind.macd60.histo
    },
    {
      name: "macd60 vs 960m",
      fn: (x, i, corrCandles) => x.ind.macd60.histo - corrCandles.getPrev(i, 960).ind.macd60.histo
    },
    {
      name: "macd60 vs 1500m",
      fn: (x, i, corrCandles) => x.ind.macd60.histo - corrCandles.getPrev(i, 1500).ind.macd60.histo
    },
    {
      name: "atr960 / atr120",
      fn: (x, i, corrCandles) => x.ind.atr960 / x.ind.atr120
    },
    {
      name: "atr960 - atr120",
      fn: (x, i, corrCandles) => x.ind.atr960 - x.ind.atr120
    },
    {
      name: "close - lrc60_PSAR",
      fn: (x, i, corrCandles) => x.close - x.ind.lrc60_PSAR.result
    },
    {
      name: "close - lrc60",
      fn: (x, i, corrCandles) => x.close - x.ind.lrc60
    },
    {
      name: "close - lrc120",
      fn: (x, i, corrCandles) => x.close - x.ind.lrc120
    },

    {
      name: "atr960",
      fn: (x, i, corrCandles) => x.close - x.ind.atr960
    },
    {
      name: "atr720",
      fn: (x, i, corrCandles) => x.close - x.ind.atr720
    },
    {
      name: "atr480",
      fn: (x, i, corrCandles) => x.close - x.ind.atr480
    },
    {
      name: "atr360",
      fn: (x, i, corrCandles) => x.close - x.ind.atr360
    },
    {
      name: "atr240",
      fn: (x, i, corrCandles) => x.close - x.ind.atr240
    },
    {
      name: "atr120",
      fn: (x, i, corrCandles) => x.close - x.ind.atr120
    },
    {
      name: "atr60",
      fn: (x, i, corrCandles) => x.close - x.ind.atr60
    },
    {
      name: "mfi60_15",
      fn: (x, i, corrCandles) => x.close - x.ind.mfi60_15
    },
    {
      name: "mfi60_30",
      fn: (x, i, corrCandles) => x.close - x.ind.mfi60_30
    },
    {
      name: "mfi120_15",
      fn: (x, i, corrCandles) => x.close - x.ind.mfi120_15
    },
    {
      name: "mfi120_30",
      fn: (x, i, corrCandles) => x.close - x.ind.mfi120_30
    },
    {
      name: "mfi120_60",
      fn: (x, i, corrCandles) => x.close - x.ind.mfi120_60
    },
    {
      name: "stochKD.k",
      fn: (x, i, corrCandles) => x.close - x.ind.stochKD.k
    },
    {
      name: "stochKD.d",
      fn: (x, i, corrCandles) => x.close - x.ind.stochKD.d
    },
    {
      name: "bbands",
      fn: (x, i, corrCandles) => x.ind.bbands.upper - x.ind.bbands.lower
    },
    {
      name: "rsi60x10",
      fn: (x, i, corrCandles) => x.ind.rsi60x10
    },
    {
      name: "rsi60x20",
      fn: (x, i, corrCandles) => x.ind.rsi60x20
    },
    {
      name: "rsi120x10",
      fn: (x, i, corrCandles) => x.ind.rsi120x10
    },
    {
      name: "zerlagMacd60",
      fn: (x, i, corrCandles) => x.ind.zerlagMacd60.histo
    },
    {
      name: "zerlagMacd120",
      fn: (x, i, corrCandles) => x.ind.zerlagMacd120.histo
    },
    {
      name: "cci",
      fn: (x, i, corrCandles) => x.ind.cci
    },
    {
      name: "macdHistoLrc - slow",
      fn: (x, i, corrCandles) => x.ind.macdHistoLrc - x.ind.macdHistoLrcSlow
    },
    {
      name: "macd60_ADX30",
      fn: (x, i, corrCandles) => x.ind.macd60_ADX30
    },
    {
      name: "macd60_ADX60",
      fn: (x, i, corrCandles) => x.ind.macd60_ADX60
    },
    {
      name: "macd60_ADX120",
      fn: (x, i, corrCandles) => x.ind.macd60_ADX120
    },
    {
      name: "macd120_ADX30",
      fn: (x, i, corrCandles) => x.ind.macd120_ADX30
    },
    {
      name: "macd120_ADX60",
      fn: (x, i, corrCandles) => x.ind.macd120_ADX60
    },
    {
      name: "macd120_ADX120",
      fn: (x, i, corrCandles) => x.ind.macd120_ADX120
    },
    {
      name: "macd60_PSAR",
      fn: (x, i, corrCandles) => x.ind.macd60_PSAR.result
    },
    {
      name: "zlema60Fast - slow",
      fn: (x, i, corrCandles) => x.ind.zlema60Fast - x.ind.zlema60Slow
    },
    {
      name: "ift60x15",
      fn: (x, i, corrCandles) => x.ind.ift60x15
    },
    {
      name: "ift30x15",
      fn: (x, i, corrCandles) => x.ind.ift30x15
    },
    {
      name: "ift60x15",
      fn: (x, i, corrCandles) => x.ind.ift60x15
    },
    {
      name: "ift120x15",
      fn: (x, i, corrCandles) => x.ind.ift120x15
    }
  ];
};

export const getFeaturesSplit = getFeaturesSplitTest;
