import { padEnd } from "lodash";
import { round2 } from "../utils";
import { EvalResults, HitRate } from "../ml/mlEvaluate";
import * as csvLog from "../csvLog";
import { GAEntity } from "./ga/common";
import { RunConfig } from "./runConfig";

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
  runConfig: RunConfig,
  coinName: string,
  rangeName: string,
  featureName: string,
  results: EvalResults,
  gaEntity?: GAEntity
) => {
  await csvLog.append(fileName, [
    new Date().toISOString(),
    coinName,
    rangeName,
    runConfig.BARRIER_LABEL,
    runConfig.PROB,
    featureName,
    runConfig.XG.idx,
    runConfig.XG.eta,
    runConfig.XG.gamma,
    runConfig.XG.max_depth,
    runConfig.XG.min_child_weight,
    runConfig.XG.subsample,
    runConfig.XG.iterations,
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
    round2(results.recall[2]),
    JSON.stringify(gaEntity)
  ]);
};

export const logFileHeader = async (fileName: string) => {
  if (!(await csvLog.exists(fileName))) {
    await csvLog.append(fileName, [
      "DATE",
      "COIN",
      "RANGE",
      "LABEL",
      "PROB",
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
      "RECALL_TWO",
      "GA_ENTITY"
    ]);
  }
};
