import { Candle } from "./types";
import { linregFX } from "./linreg";
import { PctChange } from "./types";

export const corrZLEMA = (coinName: string, candlesActual: Candle[], pctChange: PctChange) => {
  linregFX(coinName, candlesActual, x => x.ind.zlema60Slow - x.ind.zlema60Fast, pctChange, "ZLEMA");
};
