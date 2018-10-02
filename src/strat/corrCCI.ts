import { Candle } from "./types";
import { linreg } from "./linreg";
import { PctChange } from "./types";

export const corrCCI = (candlesActual: Candle[], pctChange: PctChange) => {
  linreg(candlesActual, x => x.ind.cci, pctChange._60m, "CCI vs 600m");
  linreg(candlesActual, x => x.ind.cci, pctChange._120m, "CCI vs 120m");
  linreg(candlesActual, x => x.ind.cci, pctChange._240m, "CCI vs 240m");
  linreg(candlesActual, x => x.ind.cci, pctChange._480m, "CCI vs 480m");
  linreg(candlesActual, x => x.ind.cci, pctChange._24h, "CCI vs 24h");
};
