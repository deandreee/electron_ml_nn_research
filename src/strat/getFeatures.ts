import { CorrCandles } from "./corrCalc";
import { Candle } from "./types";
import * as mlUtils from "./mlUtils";

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
  // x.ind.bbands.upppredicteder - x.ind.bbands.lower,
  // x.ind.macd60.histo,

  //   let features = corrCandles.candlesActual.map((x, i) => [x.ind.lrc10_pred - x.close]);

  // x.ind.lrc10_pred - x.close 0.06

  //   let features = corrCandles.candlesActual.map((x, i) => [getBBands(x, i, corrCandles)]);

  //   let features = corrCandles.candlesActual.map((x, i) => [
  //     getBBands(x, i, corrCandles),
  //     x.ind.atr960 - x.ind.atr120,
  //     x.ind.rsi60x10,
  //     x.ind.rsi60x20,
  //     x.ind.rsi120x10,
  //     x.ind.macdHistoLrc - x.ind.macdHistoLrcSlow // 0.59
  //   x.ind.macd120_ADX60
  // x.ind.zlema60Fast - x.ind.zlema60Slow,
  // x.ind.zerlagMacd120.histo
  //   ]);

  let features = corrCandles.candlesActual.map((x, i) => [x.ind.stochKD.k - x.ind.stochKD.d]);

  // x.ind.macd60.histo - corrCandles.getPrev(i, 120).ind.macd60.histo // 0.14
  // x.ind.macd60.histo - corrCandles.getPrev(i, 240).ind.macd60.histo // 0.22
  // x.ind.macd60.histo - corrCandles.getPrev(i, 480).ind.macd60.histo // 0.25
  // x.ind.macd60.histo - corrCandles.getPrev(i, 720).ind.macd60.histo // 0.27
  // x.ind.macd60.histo - corrCandles.getPrev(i, 960).ind.macd60.histo // 0.18
  // x.ind.macd60.histo - corrCandles.getPrev(i, 1500).ind.macd60.histo // 0.24

  //   x.ind.rsi60x20,
  //   x.ind.rsi120x10,]);

  // x.ind.atr960 / x.ind.atr120 wtf 0.38
  // x.ind.atr960 - x.ind.atr120 about the same

  //x.close - x.ind.lrc60_PSAR.result
  // x.close - x.ind.lrc120

  // x.ind.atr960

  // x.ind.mfi120_60;

  // let features = candlesActual.map(x => [

  // x.ind.stochKD.k 0.17
  // x.ind.stochKD.d 0.2

  //   x.ind.macd30.histo 0.22
  //   x.ind.macd60.histo 0.28
  //   x.ind.macd120.histo 0.21
  //   x.ind.bbands.upper - x.ind.bbands.lower,
  // x.ind.atr60,
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

  features.forEach(mlUtils.sanityCheckRow);

  return features;
};
