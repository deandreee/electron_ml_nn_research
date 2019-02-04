import { CorrCandles } from "../corr/CorrCandles";
import { RunConfig } from "../run/runConfig";

export const mlGetLabels = (corrCandles: CorrCandles, runConfig: RunConfig) => {
  return corrCandles.candlesActual.map(x => x.pctChange[runConfig.BARRIER_TYPE]);
};
