import { padEnd } from "lodash";
import { round2 } from "../utils";
import { EvalResults } from "../ml/mlEvaluate";
import * as csvLog from "../csvLog";

export const logConsole = (rangeName: string, results: EvalResults) => {
  console.log(
    padEnd(rangeName, 10),
    padEnd(round2(results.precisionTotal).toString(), 5),
    padEnd(round2(results.recallTotal).toString(), 5),
    padEnd(round2(results.fScore).toString(), 5),
    padEnd(round2(results.hitRate).toString(), 5),
    padEnd(round2(results.bigErrorsReverse).toString(), 5),
    padEnd(results.zeroHitRate, 10),
    padEnd(results.oneHitRate, 10),
    padEnd(results.twoHitRate, 10)
  );
};

export const logFile = async (
  fileName: string,
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
    round2(results.precisionTotal),
    round2(results.recallTotal),
    round2(results.fScore),
    round2(results.hitRate),
    round2(results.bigErrorsReverse),
    results.zeroHitRate,
    results.oneHitRate,
    results.twoHitRate,
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
