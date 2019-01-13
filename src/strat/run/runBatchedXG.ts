import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";

import * as log from "../log";

import * as mlXGClass from "../ml/mlXGClass";
// import * as mlXGClass from "../ml/mlXGClassProb";
import * as features from "../features";
import * as runUtils from "./runUtils";
import { logConsole, logFile } from "./logClassResults";
import { runConfigXG2, TRIPPLE_BARRIER_LABEL } from "./runConfigXG";
import { getCoreName } from "../features/FeatureSplit";

const ranges = runUtils.genRanges_TrainJunJul();
const featuresSplit = features.getKSTandPrice();

const fileName = `output/runBatchedXG/${getCoreName(featuresSplit)} [ train ${
  ranges[0].name
} ] [ lbl ${TRIPPLE_BARRIER_LABEL} ].csv`;

export const runBatchedXG = async (): Promise<RunResult> => {
  // const ranges = runUtils.genRangesLast3_JunJulAugSep();
  const months = queryCorrCandlesMonthsBatched(Coins.BTC, ranges, featuresSplit);
  const trainMonth = months[ranges[0].name];

  // runUtils.getIndMinMax(trainMonth);

  const linRegs: LinRegResult[] = [];
  const predictions = runUtils.getPredictionsTemplate();

  for (let x of featuresSplit) {
    log.start(x.name);
    const { booster } = await mlXGClass.train(runConfigXG2, trainMonth, x.fn);

    const resultsForAvg = [];

    for (let range of ranges) {
      const corrCandles = months[range.name];

      const { results, predicted } = await mlXGClass.predict(booster, corrCandles, x.fn);
      predictions[range.name][x.name] = predicted;

      logConsole(range.name, results);
      await logFile(fileName, runConfigXG2, Coins.BTC, range.name, TRIPPLE_BARRIER_LABEL, x.name, results);

      if (!range.isTrain) {
        resultsForAvg.push(results);
      }
    }

    booster.free();

    const avgResults = runUtils.calcAvgResults(resultsForAvg);
    logConsole("AVG", avgResults);
    await logFile(fileName, runConfigXG2, Coins.BTC, "AVG", TRIPPLE_BARRIER_LABEL, x.name, avgResults);

    log.end(x.name);
  }

  return {
    coin: months.Jul,
    labelsPredicted: predictions.Jul["vixFix480"] || [],
    linRegs
  };
};
