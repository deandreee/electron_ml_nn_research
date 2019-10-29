import { padEnd } from "lodash";
import { round2 } from "../utils";
import { RegResults } from "../ml/mlEvaluate";
import * as csvLog from "../csvLog";
import { GAEntity } from "../run/ga/common";
import { RunConfig } from "../run/config/runConfig";

export const logConsoleHeader = () => {
  console.log(padEnd("", 10), padEnd("MSE", 8), padEnd("R2", 8));
};

export const logConsole = (rangeName: string, results: RegResults) => {
  console.log(
    padEnd(rangeName, 10),
    padEnd(round2(results.mse).toString(), 8),
    padEnd(round2(results.r2).toString(), 8)
  );
};

export const logFile = async (
  fileName: string,
  runConfig: RunConfig,
  coinName: string,
  rangeName: string,
  featureName: string,
  results: RegResults,
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
    round2(results.mse),
    round2(results.r2),
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
      "MSE",
      "R2",
      "GA_ENTITY"
    ]);
  }
};
