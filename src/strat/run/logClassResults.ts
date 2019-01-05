import { padEnd } from "lodash";
import { round2 } from "../utils";
import { EvalResults, HitRate } from "../ml/mlEvaluate";
import * as csvLog from "../csvLog";
import { RunConfigXG } from "./runConfigXG";

export const logConsole = (rangeName: string, results: EvalResults) => {
  console.log(
    padEnd(rangeName, 10),
    padEnd(round2(results.precisionTotal).toString(), 5),
    padEnd(round2(results.recallTotal).toString(), 5),
    padEnd(round2(results.fScore).toString(), 5),
    padEnd(round2(results.hitRate).toString(), 5),
    padEnd(round2(results.bigErrorsReverse).toString(), 5),
    padEnd(formatHitRate(results.zeroHitRate), 10),
    padEnd(formatHitRate(results.oneHitRate), 10),
    padEnd(formatHitRate(results.twoHitRate), 10)
  );
};

const formatHitRate = (hitRate: HitRate) => {
  return `${hitRate.predicted}/${hitRate.actual}`;
};

export const logFile = async (
  fileName: string,
  runConfig: RunConfigXG,
  coinName: string,
  rangeName: string,
  labelName: string,
  featureName: string,
  results: EvalResults
) => {
  if (!(await csvLog.exists(fileName))) {
    await logFileHeader(fileName);
  }

  await csvLog.append(fileName, [
    new Date().toISOString(),
    coinName,
    rangeName,
    labelName,
    featureName,
    runConfig.idx,
    runConfig.eta,
    runConfig.gamma,
    runConfig.max_depth,
    runConfig.min_child_weight,
    runConfig.subsample,
    runConfig.iterations,
    round2(results.precisionTotal),
    round2(results.recallTotal),
    round2(results.fScore),
    round2(results.hitRate),
    round2(results.bigErrorsReverse),
    formatHitRate(results.zeroHitRate),
    formatHitRate(results.oneHitRate),
    formatHitRate(results.twoHitRate),
    round2(results.precision[0]),
    round2(results.recall[0]),
    round2(results.precision[1]),
    round2(results.recall[1]),
    round2(results.precision[2]),
    round2(results.recall[2])
  ]);
};

const logFileHeader = async (fileName: string) => {
  await csvLog.append(fileName, [
    "DATE",
    "COIN",
    "RANGE",
    "LABEL",
    "FEATURE",
    "IDX",
    "ETA",
    "GAMMA",
    "MAX_DEPTH",
    "MIN_CHILD_WEIGHT",
    "SUBSAMPLE",
    "ITERATIONS",
    "PREC_TOTAL",
    "RECALL_TOTAL",
    "FSCORE",
    "HITRATE",
    "BIG_ERR_REV",
    "ZERO_HITRATE",
    "ONE_HITRATE",
    "TWO_HITRATE",
    "PREC_ZERO",
    "RECALL_ZERO",
    "PREC_ONE",
    "RECALL_ONE",
    "PREC_TWO",
    "RECALL_TWO"
  ]);
};
