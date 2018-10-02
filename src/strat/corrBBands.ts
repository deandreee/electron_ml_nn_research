import { Candle } from "./types";
import { linregFX } from "./linreg";
import { PctChange } from "./types";

export const corrBBands = (coinName: string, candlesActual: Candle[], pctChange: PctChange) => {
  linregFX(coinName, candlesActual, x => x.ind.bbands.upper - x.ind.bbands.lower, pctChange, "BBands");
};
