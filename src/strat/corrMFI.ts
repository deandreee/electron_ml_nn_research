import { Candle } from "./types";
import { linreg } from "./linreg";
import { PctChange } from "./types";

export const corrMFI = (candlesActual: Candle[], pctChange: PctChange) => {
  linreg(candlesActual, x => x.ind.mfi, pctChange._60m, "MFI vs 600m");
  linreg(candlesActual, x => x.ind.mfi, pctChange._120m, "MFI vs 120m");
  linreg(candlesActual, x => x.ind.mfi, pctChange._240m, "MFI vs 240m");
  linreg(candlesActual, x => x.ind.mfi, pctChange._480m, "MFI vs 480m");
  linreg(candlesActual, x => x.ind.mfi, pctChange._24h, "MFI vs 24h");
};
