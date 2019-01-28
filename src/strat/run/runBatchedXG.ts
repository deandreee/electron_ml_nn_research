import { Coins, RunResult, LinRegResult } from "../types";
// import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";
import { queryCandlesBatched, calcIndicators } from "./queryCorrCandlesMonths";

import * as log from "../log";

// import * as mlXGClass from "../ml/mlXGClass";
import * as mlXGClass from "../ml/mlXGClassProb";
import * as features from "../features";
import * as runUtils from "./runUtils";
import { logConsole, logFile, logFileHeader } from "./logClassResults";
import { runConfigXGDef as runConfigXG, BARRIER_LABEL } from "./runConfigXG";
import { getCoreName } from "../features/FeatureSplit";

// const ranges = runUtils.genRanges_TrainJunJul();
const ranges = runUtils.genRanges_JJAS();
// const ranges = runUtils.genRanges_FastMiniTest();
// const featuresSplit = features.getValidation();
const featuresSplit = features.getEMAOCC_History();
// const featuresSplit = features.getValidationCombo();

// const featureName = "macd.vixFix.vwap.t3Macd.zerolagMACD.kst";
// const featuresSplit = [features.getCombo().find(x => x.name === featureName)];

const fileName = `output/runBatchedXG/${getCoreName(featuresSplit)} [ train ${
  ranges[0].name
} ] [ lbl ${BARRIER_LABEL} ].csv`;

export const runBatchedXG = async (): Promise<RunResult> => {
  // const months = queryCorrCandlesMonthsBatched(Coins.BTC, ranges, featuresSplit);

  await logFileHeader(fileName);

  const candleMonths = queryCandlesBatched(Coins.BTC, ranges);
  const months = calcIndicators(candleMonths, ranges, featuresSplit);

  const trainMonth = months[ranges[0].name];

  // runUtils.getIndMinMax(trainMonth);

  const linRegs: LinRegResult[] = [];
  const predictions = runUtils.getPredictionsTemplate();

  for (let x of featuresSplit) {
    log.start(x.name);
    const { booster } = await mlXGClass.train(runConfigXG, trainMonth, x.fn);

    const resultsForAvg = [];

    for (let range of ranges) {
      const corrCandles = months[range.name];

      const { results, predicted } = await mlXGClass.predict(booster, corrCandles, x.fn);
      predictions[range.name][x.name] = predicted;

      logConsole(range.name, results);
      await logFile(fileName, runConfigXG, Coins.BTC, range.name, BARRIER_LABEL, x.name, results);

      if (!range.isTrain) {
        resultsForAvg.push(results);
      }
    }

    booster.free();

    const avgResults = runUtils.calcAvgResults(resultsForAvg);
    logConsole("AVG", avgResults);
    await logFile(fileName, runConfigXG, Coins.BTC, "AVG", BARRIER_LABEL, x.name, avgResults);

    log.end(x.name);
  }

  return {
    coin: months.Jul,
    labelsPredicted: predictions.Jul["vixFix480"] || [],
    linRegs
  };
};
