import { CorrCandles } from "./corrCalc";

// export const LABEL_NAME = "_1d";
// export const LABEL_NAME = "_4d";
export const LABEL_NAME = "_10d";

export const mlGetLabels = (corrCandles: CorrCandles) => {
  return corrCandles.candlesActual.map(x => x.pctChange[LABEL_NAME]);
};
