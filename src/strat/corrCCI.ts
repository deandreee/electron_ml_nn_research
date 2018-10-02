import { Candle } from "./types";
import { linregFX } from "./linreg";
import { PctChange } from "./types";

export const corrCCI = (coinName: string, candlesActual: Candle[], pctChange: PctChange) => {
  linregFX(coinName, candlesActual, x => x.ind.cci, pctChange, "CCI");
};
