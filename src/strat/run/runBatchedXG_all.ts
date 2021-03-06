import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "../db/queryCorrCandlesMonths";

import * as log from "../log";

import * as mlXGClass from "../ml/mlXGClass";
import * as features from "../features";
import * as runUtils from "./utils/runUtils";
import { logConsole, logFile, logFileHeader, logConsoleHeader } from "../log/logResults";
import { runConfig } from "./config/runConfig";
import { CorrCandles } from "../corr/CorrCandles";
import { BatchConfig } from "../corr/BatchConfig";

// const ranges = runUtils.genRanges_JJASON();
const ranges = runUtils.genRanges_FastMiniTest();
const featureName: string = "ALL";
// const featureName: string = "COMBO";
const fileName = `output/runBatchedXG_all/${featureName} [ train ${ranges[0].name} ] [ lbl ${runConfig.BARRIER_TYPE} ${runConfig.BARRIER_LABEL} ] [ prob ${runConfig.PROB} ][ obj ${runConfig.XG_OBJECTIVE} ${runConfig.PRED_PROB} ].csv`;

const mlXG = mlXGClass;

export const runBatchedXG = async (): Promise<RunResult> => {
  // split in parts to reduce the load
  const featuresSplitParts =
    featureName === "COMBO"
      ? [features.getCombo()]
      : [features.getAllPart1(), features.getAllPart2(), features.getAllPart3()];

  const predictions = runUtils.getPredictionsTemplate();
  const linRegs: LinRegResult[] = [];

  await logFileHeader(fileName, runConfig);

  for (let featuresSplit of featuresSplitParts) {
    const months = queryCorrCandlesMonthsBatched(runConfig, Coins.BTC, ranges, featuresSplit);
    const trainMonth = months[ranges[0].name];

    for (let feature of featuresSplit) {
      log.start(feature.name);
      const { booster } = await mlXG.train(runConfig, trainMonth, feature.fn);

      const resultsForAvg = [];
      logConsoleHeader(runConfig);
      for (let range of ranges) {
        const corrCandles = months[range.name];

        const { results, predicted } = await mlXG.predict(runConfig, booster, corrCandles, feature.fn);
        predictions[range.name][feature.name] = predicted;

        logConsole(range.name, results);
        await logFile(fileName, runConfig, Coins.BTC, range.name, feature.name, results);

        if (!range.isTrain) {
          resultsForAvg.push(results);
        }
      }

      booster.free();

      const avgResults = runUtils.calcAvgResults(resultsForAvg);
      logConsole("AVG", avgResults);
      await logFile(fileName, runConfig, Coins.BTC, "AVG", feature.name, avgResults);

      log.end(feature.name);
    }
  }

  return {
    coin: new CorrCandles({ name: "BTC", candles: [] }, [], [], new BatchConfig(0, 0)),
    months: {},
    labelsPredicted: [],
    linRegs
  };
};
