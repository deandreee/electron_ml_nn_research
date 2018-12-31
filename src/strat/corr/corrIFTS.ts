import { Candle } from "../types";
import { linregFX } from "../linreg";
import { PctChange } from "../types";

export const corrIFTS = (coinName: string, candlesActual: Candle[], pctChange: PctChange) => {
  linregFX(coinName, candlesActual, x => x.ind.ift.x30.p5, pctChange, "ift30x5");
  linregFX(coinName, candlesActual, x => x.ind.ift.x60.p5, pctChange, "ift60x5");
  linregFX(coinName, candlesActual, x => x.ind.ift.x60.p15, pctChange, "ift60x15");
  linregFX(coinName, candlesActual, x => x.ind.ift.x10.p15, pctChange, "ift10x15");
  linregFX(coinName, candlesActual, x => x.ind.ift.x30.p15, pctChange, "ift30x15");
  linregFX(coinName, candlesActual, x => x.ind.ift.x120.p15, pctChange, "ift120x15");
  linregFX(coinName, candlesActual, x => x.ind.ift.x10.p30, pctChange, "ift10x30");
  linregFX(coinName, candlesActual, x => x.ind.ift.x60.p30, pctChange, "ift60x30");
  linregFX(coinName, candlesActual, x => x.ind.ift.x120.p30, pctChange, "ift120x30");

  linregFX(coinName, candlesActual, x => x.ind.ifts.x10.p15, pctChange, "ifts10x15");
  linregFX(coinName, candlesActual, x => x.ind.ifts.x30.p15, pctChange, "ifts30x15");
  linregFX(coinName, candlesActual, x => x.ind.ifts.x60.p15, pctChange, "ifts60x15");
};
