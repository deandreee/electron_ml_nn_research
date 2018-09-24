import { Candle } from "./types";
import { linreg } from "./linreg";
import { PctChange } from "./types";

export const corrZLEMA = (candlesActual: Candle[], pctChange: PctChange) => {
  linreg(
    candlesActual,
    x => x.ind.zlema60Slow - x.ind.zlema60Fast,
    pctChange._10m,
    "ZLEMA vs 10m"
  );

  linreg(
    candlesActual,
    x => x.ind.zlema60Slow - x.ind.zlema60Fast,
    pctChange._60m,
    "ZLEMA vs 60m"
  );

  linreg(
    candlesActual,
    x => x.ind.zlema60Slow - x.ind.zlema60Fast,
    pctChange._120m,
    "ZLEMA vs 120m"
  );

  linreg(
    candlesActual,
    x => x.ind.zlema60Slow - x.ind.zlema60Fast,
    pctChange._240m,
    "ZLEMA vs 240m"
  );
};
