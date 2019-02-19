import { Coins, RunResult, LinRegResult, Prediction } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";
// import { queryCandlesBatched, calcIndicators } from "./queryCorrCandlesMonths";

import * as log from "../log";

import * as mlXGClass from "../ml/mlXGClass";
import * as features from "../features";
import * as runUtils from "./runUtils";
import { logConsole, logFile, logFileHeader } from "../log/logResults";
import { runConfig } from "./runConfig";
import { getCoreName } from "../features/FeatureSplit";

// const ranges = runUtils.genRanges_TrainJunJul();
// const ranges = runUtils.genRanges_JJAS();
// const ranges = runUtils.genRanges_JJASON();
const ranges = runUtils.genRanges_FastMiniTest();
// const featuresSplit = features.getValidation();

// const featuresSplit = features.getRSI();
// const featuresSplit = features.getBBands();
// const featuresSplit = features.getBBandsAndPrice(); // not working, name not bbands...
// const featuresSplit = features.getMFI();
// const featuresSplit = features.getStochKD();
// const featuresSplit = features.getEMAOCC();
// const featuresSplit = features.getEMAOCC_Price();
// const featuresSplit = features.getEMAOCC_HistoryHrs();
// const featuresSplit = features.getEMAOCC_HistoryDays();
// const featuresSplit = features.getT3MACD();
// const featuresSplit = features.getT3MACD_HistoryHrs();
// const featuresSplit = features.getT3MACD_HistoryDays();
// const featuresSplit = features.getZerolagT3();
// const featuresSplit = features.getLRC();
// const featuresSplit = features.getLRC_HistoryHrs();
// const featuresSplit = features.getLRC_HistoryDays();
// const featuresSplit = features.getMACD();
// const featuresSplit = features.getMACD_HistoryHrs();
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
// const featuresSplit = features.getVixFix();
// const featuresSplit = features.getVixFix_HistoryDays();
// const featuresSplit = features.getAllPart2();
// const featuresSplit = features.getRSI_HistoryHrs();

// const featureName = "macd.vixFix.vwap.t3Macd.zerolagMACD.kst";
// const featureName = "vixFix.x1440.b.days";
// const featureName = "chandelierExit.x480.p5_2";
// const featureName = "kst.x1440.p_sig3_roc5_smaroc_5.price";
const featureName = "lrc.x480.p60.hrs";
// const featureName = "psar.x60.p0_004";
// const featureName = "emaOCC.x240.p40.price";
const featuresSplit = features.getByName([featureName]);

// const featureName = "emaOCC.x240.p10.price";
// const featuresSplit = [features.getEMAOCC_Price().find(x => x.name === featureName)];

// const featureName = "zerolagT3.x480.p60";
// const featuresSplit = [features.getZerolagT3().find(x => x.name === featureName)];

// LBL TWO
// const featureNames = [
//   "t3Macd.x480.sig9",
//   "rsi.x120.p15.days",
//   "kst.x480.p_sig3_roc5_smaroc_5.days",
//   "vixFix.x60.b.days"
// ];
// const featuresSplit = features.getByName(featureNames);

// LBL FIVE
// const featureNames = [
//   "stochKD.x1440.p45",
//   "emaOCC.x1440.p25.hrs",
//   "chandelierExit.x240.p10_2",
//   "macd.x1440.sig2_16.hrs",
//   "vixFix.x1440.c"
// ];
// const featuresSplit = features.getByName(featureNames);

// const mlXG = runConfig.PROB === 0 ? mlXGClass : mlXGClassProb;
const mlXG = mlXGClass; // TODO: fix

const fileName = `output/runBatchedXG/${getCoreName(featuresSplit)} [ train ${ranges[0].name} ] [ lbl ${
  runConfig.BARRIER_TYPE
} ${runConfig.BARRIER_LABEL} ] [ prob ${runConfig.PROB} ][ obj ${runConfig.XG_OBJECTIVE} ${runConfig.PRED_PROB} ].csv`;

export const runBatchedXG = async (): Promise<RunResult> => {
  const months = queryCorrCandlesMonthsBatched(runConfig, Coins.BTC, ranges, featuresSplit);

  await logFileHeader(fileName, runConfig);

  // const candleMonths = queryCandlesBatched(Coins.BTC, ranges);
  // const months = calcIndicators(candleMonths, ranges, featuresSplit);

  const trainMonth = months[ranges[0].name];

  // runUtils.getIndMinMax(trainMonth);

  const linRegs: LinRegResult[] = [];
  const predictions = runUtils.getPredictionsTemplate();

  for (let x of featuresSplit) {
    log.start(x.name);
    const { booster } = await mlXG.train(runConfig, trainMonth, x.fn);

    const resultsForAvg: mlXGClass.EvalResults[] = [];

    for (let range of ranges) {
      const corrCandles = months[range.name];

      const { results, predicted } = await mlXG.predict(runConfig, booster, corrCandles, x.fn);
      predictions[range.name][x.name] = predicted;

      logConsole(range.name, results);
      await logFile(fileName, runConfig, Coins.BTC, range.name, x.name, results);

      if (!range.isTrain) {
        resultsForAvg.push(results);
      }
    }

    booster.free();

    const avgResults = runUtils.calcAvgResults(resultsForAvg);
    logConsole("AVG", avgResults);
    await logFile(fileName, runConfig, Coins.BTC, "AVG", x.name, avgResults);

    log.end(x.name);
  }

  const labelsPredicted: Prediction[] = featuresSplit.map(x => ({
    name: x.name,
    values: predictions.Dec[x.name] || []
  }));

  return {
    coin: months["Dec"],
    labelsPredicted,
    linRegs
  };
};
