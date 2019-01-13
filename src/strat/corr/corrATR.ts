import { Candle } from "../types";
import { linregFX } from "../linreg";
import { PctChange } from "../types";

export const corrATR = (coinName: string, candlesActual: Candle[], pctChange: PctChange) => {
  linregFX(coinName, candlesActual, x => x.ind.atr.p60, pctChange, "ATR 60");
  linregFX(coinName, candlesActual, x => x.ind.atr.p240, pctChange, "ATR 240");
  linregFX(coinName, candlesActual, x => x.ind.atr.p240 - x.ind.atr.p60, pctChange, "ATR DIFF");
};
