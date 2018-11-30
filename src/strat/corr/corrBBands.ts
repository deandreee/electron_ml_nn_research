import { Candle } from "../types";
import { linregFX } from "../linreg";
import { PctChange } from "../types";

export const corrBBands = (coinName: string, candlesActual: Candle[], pctChange: PctChange) => {
  linregFX(coinName, candlesActual, x => x.ind.bbands60_20_2.upper - x.ind.bbands60_20_2.lower, pctChange, "BBands");
};
