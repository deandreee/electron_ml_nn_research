import { Candle } from "../types";
import { linregFX } from "../linreg";
import { PctChange } from "../types";

export const corrBBands = (coinName: string, candlesActual: Candle[], pctChange: PctChange) => {
  linregFX(
    coinName,
    candlesActual,
    x => x.ind.bbands.x60.p20_dev2.upper - x.ind.bbands.x60.p20_dev2.lower,
    pctChange,
    "BBands"
  );
};
