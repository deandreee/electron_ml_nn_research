import { CorrCandles } from "../corr/CorrCandles";
import { RunConfig, isRegression } from "../run/config/runConfig";
import { round2 } from "../utils";

export const mlGetLabels = (corrCandles: CorrCandles, runConfig: RunConfig) => {
  let labels = corrCandles.candlesActual.map(x => x.pctChange[runConfig.BARRIER_TYPE]);
  if (isRegression(runConfig)) {
    labels = labels.map(x => round2(x));
  }
  return labels;
};
