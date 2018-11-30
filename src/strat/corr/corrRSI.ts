import { Candle } from "../types";
import { linregFX } from "../linreg";
import { linregSplitRSI } from "../linregSplitRSI";
import { PctChange } from "../types";

export const corrRSI = (coinName: string, candlesActual: Candle[], pctChange: PctChange) => {
  linregFX(coinName, candlesActual, x => x.ind.rsi60x10, pctChange, "RSI");

  linregSplitRSI(candlesActual, x => x.ind.rsi60x10, pctChange._120m, "SPLIT RSI 120m");
  linregSplitRSI(candlesActual, x => x.ind.rsi60x10, pctChange._240m, "SPLIT RSI 240m");
};
