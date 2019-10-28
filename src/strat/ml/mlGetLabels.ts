import { CorrCandles } from "../corr/CorrCandles";
import { RunConfig } from "../run/config/runConfig";
import { round2 } from "../utils";

export const mlGetLabels = (corrCandles: CorrCandles, runConfig: RunConfig) => {
  let labels = corrCandles.candlesActual.map(x => x.pctChange[runConfig.BARRIER_TYPE]);
  if (runConfig.XG_OBJECTIVE.startsWith("reg:")) {
    labels = labels.map(x => round2(x));
  }
  return labels;
};
