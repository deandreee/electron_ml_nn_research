import { CorrCandles } from "./corrCalc";

export const getFeatures = (corrCandles: CorrCandles) => {
  // x.ind.bbands.upppredicteder - x.ind.bbands.lower,
  // x.ind.macd60.histo,

  let features = corrCandles.candlesActual.map((x, i) => [x.ind.lrc10_pred - x.close]);

  //   let features = corrCandles.candlesActual.map((x, i) => {
  //     const bbandsNow = x.ind.bbands.upper - x.ind.bbands.lower;
  //     const candlePrev = corrCandles.getPrev(i, 480);
  //     const bbandsPrev = candlePrev.ind.bbands.upper - candlePrev.ind.bbands.lower;

  //     // - better than /
  //     // much better
  //     // 60 ok | 120 ok | 240 ok | 480 nok
  //     return [bbandsNow - bbandsPrev];
  //   });

  // x.ind.atr960 / x.ind.atr120 wtf 0.38
  // x.ind.atr960 - x.ind.atr120 about the same

  //x.close - x.ind.lrc60_PSAR.result
  // x.close - x.ind.lrc120

  // x.ind.atr960

  // x.ind.mfi120_60;

  // let features = candlesActual.map(x => [
  //   x.ind.macd60.histo,
  //   x.ind.macd120.histo,
  //   x.ind.bbands.upper - x.ind.bbands.lower,
  // x.ind.atr60,
  //   // x.ind.atr240
  //   x.ind.rsi60x10,
  //   x.ind.rsi60x20,
  //   x.ind.rsi120x10,

  //   // x.ind.zerlagMacd60.histo
  //   x.ind.zerlagMacd120.histo,
  //   x.ind.cci,

  //   x.ind.macdHistoLrc - x.ind.macdHistoLrcSlow,
  //   x.ind.macd120_ADX60
  //   // x.ind.macd60_PSAR.result
  //   // x.ind.zlema60Fast - x.ind.zlema60Slow
  //   // x.ind.ift60x15
  //   // x.ind.vixFix

  //   // x.ind.bbands.upper - x.ind.bbands.lower,
  //   //
  //   // x.ind.ift60x15,
  //   // x.ind.ift30x15,
  //   // x.ind.ift120x15,
  // ]);
  // let features = candlesActual.map(x => [x.ind.ifts30x15, x.ind.ifts60x15]);

  return features;
};
