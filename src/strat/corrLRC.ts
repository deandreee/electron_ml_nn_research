import { Candle } from "./types";
import { linreg } from "./linreg";
import { PctChange } from "./types";

export const corrLRC = (candlesActual: Candle[], pctChange: PctChange) => {
  linreg(candlesActual, x => x.ind.lrc60, pctChange._120m, "LRC60 vs 120m");
};
