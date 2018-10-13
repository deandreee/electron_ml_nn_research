import { CorrCandles } from "./corrCalc";

export const LABEL_NAME = "_7d";

export const mlGetLabels = (corrCandles: CorrCandles) => {
  return corrCandles.candlesActual.map(x => x.pctChange[LABEL_NAME]);
};
