import { Candle } from "./types";
import { linregFX } from "./linreg";
import { PctChange } from "./types";

export const corrMFI = (coinName: string, candlesActual: Candle[], pctChange: PctChange) => {
  linregFX(coinName, candlesActual, x => x.ind.mfi60_30, pctChange, "MFI");
};
