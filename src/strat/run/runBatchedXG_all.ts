import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";

import * as log from "../log";

import * as mlXGClass from "../ml/mlXGClass";
// import * as mlXGClass from "../ml/mlXGClassProb";
import * as features from "../features";
import * as runUtils from "./runUtils";
import { logConsole, logFile } from "./logClassResults";
import { runConfigXG2, BARRIER_LABEL, batchConfig } from "./runConfigXG";

const ranges = runUtils.genRangesFull();
// const featureName: string = "ALL";
const featureName: string = "COMBO";
const fileName = `output/runBatchedXG_all/${featureName} [ train ${ranges[0].name} ] [ lbl ${BARRIER_LABEL} ].csv`;

export const runBatchedXG = async (): Promise<RunResult> => {
  const featuresSplit = featureName === "COMBO" ? features.getCombo() : features.getAll();

  const months = queryCorrCandlesMonthsBatched(batchConfig, Coins.BTC, ranges, featuresSplit);
  const trainMonth = months[ranges[0].name];

  const linRegs: LinRegResult[] = [];
  const predictions = runUtils.getPredictionsTemplate();

  for (let feature of featuresSplit) {
    log.start(feature.name);
    const { booster } = await mlXGClass.train(runConfigXG2, trainMonth, feature.fn);

    const resultsForAvg = [];

    for (let range of ranges) {
      const corrCandles = months[range.name];

      const { results, predicted } = await mlXGClass.predict(booster, corrCandles, feature.fn);
      predictions[range.name][feature.name] = predicted;

      logConsole(range.name, results);
      await logFile(fileName, runConfigXG2, Coins.BTC, range.name, BARRIER_LABEL, feature.name, results);

      if (!range.isTrain) {
        resultsForAvg.push(results);
      }
    }

    booster.free();

    const avgResults = runUtils.calcAvgResults(resultsForAvg);
    logConsole("AVG", avgResults);
    await logFile(fileName, runConfigXG2, Coins.BTC, "AVG", BARRIER_LABEL, feature.name, avgResults);

    log.end(feature.name);
  }

  return {
    coin: months.Jul,
    labelsPredicted: predictions.Jul["vixFix480"] || [],
    linRegs
  };
};
