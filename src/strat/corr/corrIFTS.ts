import { Candle } from "../types";
import { linregFX } from "../linreg";
import { PctChange } from "../types";

export const corrIFTS = (coinName: string, candlesActual: Candle[], pctChange: PctChange) => {
  linregFX(coinName, candlesActual, x => x.ind.ift30x5, pctChange, "ift30x5");
  linregFX(coinName, candlesActual, x => x.ind.ift60x5, pctChange, "ift60x5");
  linregFX(coinName, candlesActual, x => x.ind.ift60x15, pctChange, "ift60x15");
  linregFX(coinName, candlesActual, x => x.ind.ift10x15, pctChange, "ift10x15");
  linregFX(coinName, candlesActual, x => x.ind.ift30x15, pctChange, "ift30x15");
  linregFX(coinName, candlesActual, x => x.ind.ift120x15, pctChange, "ift120x15");
  linregFX(coinName, candlesActual, x => x.ind.ift10x30, pctChange, "ift10x30");
  linregFX(coinName, candlesActual, x => x.ind.ift60x30, pctChange, "ift60x30");
  linregFX(coinName, candlesActual, x => x.ind.ift120x30, pctChange, "ift120x30");

  linregFX(coinName, candlesActual, x => x.ind.ifts10x15, pctChange, "ifts10x15");
  linregFX(coinName, candlesActual, x => x.ind.ifts30x15, pctChange, "ifts30x15");
  linregFX(coinName, candlesActual, x => x.ind.ifts60x15, pctChange, "ifts60x15");
};
