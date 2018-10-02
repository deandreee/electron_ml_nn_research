import { Candle } from "./types";
import { linregFX } from "./linreg";
import { PctChange } from "./types";
import { round2 } from "./utils";

export const corrMACD = (coinName: string, candlesActual: Candle[], pctChange: PctChange) => {
  linregFX(coinName, candlesActual, x => round2(x.ind.macd120.histo), pctChange, "MACD");
  linregFX(coinName, candlesActual, x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc, pctChange, "MACD LRC");
  linregFX(coinName, candlesActual, x => x.ind.macd60_PSAR.result, pctChange, "MACD PSAR");
};
