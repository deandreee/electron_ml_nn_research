import { CorrCandles } from "../corr/CorrCandles";
import { BARRIER_TYPE } from "../run/runConfigXG";

export const mlGetLabels = (corrCandles: CorrCandles) => {
  return corrCandles.candlesActual.map(x => x.pctChange[BARRIER_TYPE]);
};
