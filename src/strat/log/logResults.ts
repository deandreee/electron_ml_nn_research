import { GAEntity } from "../run/ga/common";
import { RunConfig, isRegression } from "../run/config/runConfig";
import { EvalResults } from "../ml/mlXGClass";
import * as logClassResults from "./logClassResults";
import * as logRegResults from "./logRegResults";

export const logConsoleHeader = (runConfig: RunConfig) => {
  if (isRegression(runConfig)) {
    logRegResults.logConsoleHeader();
  } else {
    logClassResults.logConsoleHeader();
  }
};

export const logConsole = (rangeName: string, results: EvalResults) => {
  const { clasifResults, regResults } = results;

  if (clasifResults) {
    logClassResults.logConsole(rangeName, clasifResults);
  } else {
    logRegResults.logConsole(rangeName, regResults);
  }
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
  const { clasifResults, regResults } = results;

  if (clasifResults) {
    await logClassResults.logFile(fileName, runConfig, coinName, rangeName, featureName, clasifResults, gaEntity);
  } else {
    await logRegResults.logFile(fileName, runConfig, coinName, rangeName, featureName, regResults, gaEntity);
  }
};

export const logFileHeader = async (fileName: string, runConfig: RunConfig) => {
  if (isRegression(runConfig)) {
    await logRegResults.logFileHeader(fileName);
  } else {
    await logClassResults.logFileHeader(fileName);
  }
};
