import { Candle } from "./types";
import { linregFX } from "./linreg";
import { PctChange } from "./types";

export const corrIFTS = (candlesActual: Candle[], pctChange: PctChange) => {
  linregFX(candlesActual, x => x.ind.ifts10x15, pctChange, "ifts10x15");
  linregFX(candlesActual, x => x.ind.ifts30x15, pctChange, "ifts30x15");
  linregFX(candlesActual, x => x.ind.ifts60x15, pctChange, "ifts60x15");
};
