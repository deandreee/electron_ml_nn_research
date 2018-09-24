import { Candle } from "./types";
import { linreg } from "./linreg";
import { linregSplitRSI } from "./linregSplitRSI";
import { PctChange } from "./types";

export const corrRSI = (candlesActual: Candle[], pctChange: PctChange) => {
  linreg(candlesActual, x => x.ind.rsi, pctChange._10m, "RSI vs 10m");
  linreg(candlesActual, x => x.ind.rsi, pctChange._60m, "RSI vs 60m");
  linreg(candlesActual, x => x.ind.rsi, pctChange._120m, "RSI vs 120m");
  linreg(candlesActual, x => x.ind.rsi, pctChange._240m, "RSI vs 240m");

  linregSplitRSI(
    candlesActual,
    x => x.ind.rsi,
    pctChange._120m,
    "SPLIT RSI 120m"
  );

  linregSplitRSI(
    candlesActual,
    x => x.ind.rsi,
    pctChange._240m,
    "SPLIT RSI 240m"
  );
};
