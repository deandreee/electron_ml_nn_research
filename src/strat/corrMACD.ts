import { Candle } from "./types";
import { linreg } from "./linreg";
import { PctChange } from "./types";
// import { round2 } from "./utils";

export const corrMACD = (candlesActual: Candle[], pctChange: PctChange) => {
  // linreg(
  //   candlesActual,
  //   x => round2(x.ind.macd120.histo),
  //   pctChange._10m,
  //   "MACD vs 10m"
  // );

  // linreg(
  //   candlesActual,
  //   x => round2(x.ind.macd120.histo),
  //   pctChange._60m,
  //   "MACD vs 60m"
  // );

  // linreg(
  //   candlesActual,
  //   x => round2(x.ind.macd120.histo),
  //   pctChange._120m,
  //   "MACD vs 120m"
  // );

  // linreg(
  //   candlesActual,
  //   x => round2(x.ind.macd120.histo),
  //   pctChange._240m,
  //   "MACD vs 240m"
  // );

  // /// LRC ///

  // linreg(
  //   candlesActual,
  //   x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc,
  //   pctChange._10m,
  //   "MACD LRC vs 10m"
  // );

  // linreg(
  //   candlesActual,
  //   x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc,
  //   pctChange._60m,
  //   "MACD LRC vs 60m"
  // );

  // linreg(
  //   candlesActual,
  //   x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc,
  //   pctChange._120m,
  //   "MACD LRC vs 120m"
  // );

  // linreg(
  //   candlesActual,
  //   x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc,
  //   pctChange._240m,
  //   "MACD LRC vs 240m"
  // );

  // linreg(
  //   candlesActual,
  //   x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc,
  //   pctChange._480m,
  //   "MACD LRC vs 480m"
  // );

  // linreg(
  //   candlesActual,
  //   x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc,
  //   pctChange._24h,
  //   "MACD LRC vs 24h"
  // );

  /// PSAR ///

  linreg(
    candlesActual,
    x => x.ind.macd60_PSAR.result,
    pctChange._10m,
    "MACD PSAR vs 10m"
  );

  linreg(
    candlesActual,
    x => x.ind.macd60_PSAR.result,
    pctChange._60m,
    "MACD PSAR vs 60m"
  );

  linreg(
    candlesActual,
    x => x.ind.macd60_PSAR.result,
    pctChange._120m,
    "MACD PSAR vs 120m"
  );

  linreg(
    candlesActual,
    x => x.ind.macd60_PSAR.result,
    pctChange._240m,
    "MACD PSAR vs 240m"
  );

  linreg(
    candlesActual,
    x => x.ind.macd60_PSAR.result,
    pctChange._480m,
    "MACD PSAR vs 480m"
  );

  linreg(
    candlesActual,
    x => x.ind.macd60_PSAR.result,
    pctChange._24h,
    "MACD PSAR vs 24h"
  );
};
