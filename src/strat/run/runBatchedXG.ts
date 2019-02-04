import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";
// import { queryCandlesBatched, calcIndicators } from "./queryCorrCandlesMonths";

import * as log from "../log";

// import * as mlXGClass from "../ml/mlXGClass";
import * as mlXGClass from "../ml/mlXGClassProb";
import * as features from "../features";
import * as runUtils from "./runUtils";
import { logConsole, logFile, logFileHeader } from "./logClassResults";
import { runConfigXGDef as runConfigXG, BARRIER_LABEL, batchConfig } from "./runConfigXG";
import { getCoreName } from "../features/FeatureSplit";

// const ranges = runUtils.genRanges_TrainJunJul();
const ranges = runUtils.genRanges_JJAS();
// const ranges = runUtils.genRanges_FastMiniTest();
// const featuresSplit = features.getValidation();

// const featuresSplit = features.getRSI();
// const featuresSplit = features.getBBands();
// const featuresSplit = features.getBBandsAndPrice(); // not working, name not bbands...
// const featuresSplit = features.getMFI();
// const featuresSplit = features.getStochKD();
// const featuresSplit = features.getEMAOCC();
// const featuresSplit = features.getEMAOCC_Price();
// const featuresSplit = features.getEMAOCC_History();
// const featuresSplit = features.getT3MACD();
// const featuresSplit = features.getZerolagT3();
// const featuresSplit = features.getLRC();
// const featuresSplit = features.getLRC_HistoryHrs();
// const featuresSplit = features.getLRC_HistoryDays();
// const featuresSplit = features.getMACD();
// const featuresSplit = features.getZerolagMACD();
// const featuresSplit = features.getVixFix();
// const featuresSplit = features.getVixFix_HistoryHrs();
// const featuresSplit = features.getVixFix_HistoryDays();
// const featuresSplit = features.getKST();
// const featuresSplit = features.getVWAP();
// const featuresSplit = features.getWilliamsR();
// const featuresSplit = features.getPSAR();
// const featuresSplit = features.getKalman();
// const featuresSplit = features.getKalmanDiff();
// const featuresSplit = features.getChandelierExit();
// const featuresSplit = features.getKeltner();
// const featuresSplit = features.getVixFix();
// const featuresSplit = features.getVixFix();
// const featuresSplit = features.getVixFix_HistoryHrs();
// const featuresSplit = features.getVixFix_HistoryDays();
// const featuresSplit = features.getAllPart2();
const featuresSplit = features.getKST_HistoryDays();

// const featuresSplit = features.getValidationCombo();
// const featureName = "macd.vixFix.vwap.t3Macd.zerolagMACD.kst";
// const featuresSplit = [features.getCombo().find(x => x.name === featureName)];

// const featureName = "vixFix.x240.h.days";
// const featuresSplit = [features.getVixFix_HistoryDays().find(x => x.name === featureName)];

const fileName = `output/runBatchedXG/${getCoreName(featuresSplit)} [ train ${
  ranges[0].name
} ] [ lbl ${BARRIER_LABEL} ].csv`;

export const runBatchedXG = async (): Promise<RunResult> => {
  const months = queryCorrCandlesMonthsBatched(batchConfig, Coins.BTC, ranges, featuresSplit);

  await logFileHeader(fileName);

  // const candleMonths = queryCandlesBatched(Coins.BTC, ranges);
  // const months = calcIndicators(candleMonths, ranges, featuresSplit);

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
    coin: months["Dec"],
    labelsPredicted: predictions.Dec["vixFix.x1440.a"] || [],
    linRegs
  };
};
