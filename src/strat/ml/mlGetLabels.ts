import { CorrCandles } from "../corr/CorrCandles";

// export const LABEL_NAME = "_60m";
// export const LABEL_NAME = "_120m";
// export const LABEL_NAME = "_240m";
// export const LABEL_NAME = "_480m";
// export const LABEL_NAME = "_1d";
// export const LABEL_NAME = "_4d";
// export const LABEL_NAME = "_10d";
export const LABEL_NAME = "trippleBarrier";

export const mlGetLabels = (corrCandles: CorrCandles) => {
  return corrCandles.candlesActual.map(x => x.pctChange[LABEL_NAME]);
};
