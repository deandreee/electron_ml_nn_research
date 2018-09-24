import { Candle } from "./types";
import { linreg } from "./linreg";
import { PctChange } from "./types";

export const corrBBands = (candlesActual: Candle[], pctChange: PctChange) => {
  linreg(
    candlesActual,
    x => x.ind.bbands.upper - x.ind.bbands.lower,
    pctChange._10m,
    "BBands vs 10m"
  );

  linreg(
    candlesActual,
    x => x.ind.bbands.upper - x.ind.bbands.lower,
    pctChange._60m,
    "BBands vs 60m"
  );

  linreg(
    candlesActual,
    x => x.ind.bbands.upper - x.ind.bbands.lower,
    pctChange._120m,
    "BBands vs 120m"
  );

  linreg(
    candlesActual,
    x => x.ind.bbands.upper - x.ind.bbands.lower,
    pctChange._240m,
    "BBands vs 240m"
  );
};
