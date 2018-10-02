import { Candle } from "./types";
import { linreg } from "./linreg";
import { PctChange } from "./types";

export const corrATR = (candlesActual: Candle[], pctChange: PctChange) => {
  linreg(candlesActual, x => x.ind.atr60, pctChange._60m, "ATR 60 vs 60m");
  linreg(candlesActual, x => x.ind.atr60, pctChange._120m, "ATR 60 vs 120m");
  linreg(candlesActual, x => x.ind.atr60, pctChange._240m, "ATR 60 vs 240m");
  linreg(candlesActual, x => x.ind.atr60, pctChange._480m, "ATR 60 vs 480m");
  linreg(candlesActual, x => x.ind.atr60, pctChange._24h, "ATR 60 vs 24h");

  linreg(candlesActual, x => x.ind.atr240, pctChange._60m, "ATR 240 vs 60m");
  linreg(candlesActual, x => x.ind.atr240, pctChange._120m, "ATR 240 vs 120m");
  linreg(candlesActual, x => x.ind.atr240, pctChange._240m, "ATR 240 vs 240m");
  linreg(candlesActual, x => x.ind.atr240, pctChange._480m, "ATR 240 vs 480m");
  linreg(candlesActual, x => x.ind.atr240, pctChange._24h, "ATR 240 vs 24h");

  linreg(
    candlesActual,
    x => x.ind.atr240 - x.ind.atr60,
    pctChange._60m,
    "ATR DIFF vs 60m"
  );
  linreg(
    candlesActual,
    x => x.ind.atr240 - x.ind.atr60,
    pctChange._120m,
    "ATR DIFF vs 120m"
  );
  linreg(
    candlesActual,
    x => x.ind.atr240 - x.ind.atr60,
    pctChange._240m,
    "ATR DIFF vs 240m"
  );
  linreg(
    candlesActual,
    x => x.ind.atr240 - x.ind.atr60,
    pctChange._480m,
    "ATR DIFF vs 480m"
  );
  linreg(
    candlesActual,
    x => x.ind.atr240 - x.ind.atr60,
    pctChange._24h,
    "ATR DIFF vs 24h"
  );
};
