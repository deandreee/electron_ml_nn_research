import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";

import * as mlXGClass from "../ml/mlXGClass";
// import * as mlXGClass from "../ml/mlXGClassProb";
import * as features from "../features";
import * as runUtils from "./utils/runUtils";
import { runConfig as runConfigBase } from "./config/runConfig";
import { RunConfigXG } from "./config/runConfigXG";

import { logConsole, logFile } from "../log/logResults";
// import * as log from "../log";

import { gaConfig, userData, GAEntity } from "./ga/common";
import { GACore } from "./ga/GACore";
import * as GAOpts from "./ga/GAOpts";

import { sum } from "lodash";

// const featureName = "x240.macd.sig9";
// const feature = features.getMACD().find(x => x.name === featureName);

// const featureName = "[csi]combo_single_each";
// const feature = features.getCombo().find(x => x.name === featureName);

// const featureName = "x120.vixFix.a";
// const feature = features.getVixFix().find(x => x.name === featureName);

// const featureName = "vixFixCombo";
// const featureName = "macd.vixFix";
// const featureName = "macd.vixFix.vwap";
// const featureName = "macd.vixFix.vwap.kst";
// const featureName = "macd.vixFix.vwap.t3Macd";
// const featureName = "macd.vixFix.vwap.emaOCC";
// const featureName = "macd.vixFix.vwap.psar";
// const featureName = "macd.vixFix.vwap.zerolagMACD";
// const featureName = "macd.vixFix.vwap.lrc";
// const featureName = "macd.vixFix.vwap.t3Macd.zerolagMACD.kst";
// const feature = features.getCombo().find(x => x.name === featureName);

// const featureName = "kalman.x240.r001_q1";
// const feature = features.getKalmanDiff().find(x => x.name === featureName);

// const featureName = "emaOCC.x1440.p20";
// const feature = features.getEMAOCC_History().find(x => x.name === featureName);

// const featureName = "emaOCC.vixFix.kst2.lrc.mfi.chandelierExit.t3Macd.bbands.rsi";
// const feature = features.getValidationFive().find(x => x.name === featureName);

// const featureName = "emaOCC.x1440.p25.hrs";
// const feature = features.getEMAOCC_HistoryHrs().find(x => x.name === featureName);

// const featureName = "chandelierExit.x120.p20_3";
// const feature = features.getChandelierExit().find(x => x.name === featureName);

// const featureName = "kst.x1440.p_sig3_roc5_smaroc_5.price";
// const feature = features.getKST_Price().find(x => x.name === featureName);

const featureName = "bbands.x240.p20_dev1";
const feature = features.getBBands().find(x => x.name === featureName);

const fileName = `output/runBatchedXG_wGA/${featureName}_[lbl=${runConfigBase.BARRIER_LABEL}].csv`;
const coin = Coins.BTC;

export const runBatchedXG = async (): Promise<RunResult> => {
  const ranges = runUtils.genRanges_JJASON();
  const months = queryCorrCandlesMonthsBatched(runConfigBase, coin, ranges, [feature]);
  const trainMonth = months[ranges[0].name];

  const linRegs: LinRegResult[] = [];
  const predictions = runUtils.getPredictionsTemplate();

  const fnFitness = async (gaEntity: GAEntity) => {
    // log.start(runConfigXG.getName(runConfig), true); // let's skip for now, too much noise

    const runConfig = { ...runConfigBase, XG: gaEntity as RunConfigXG };

    const { booster } = await mlXGClass.train(runConfig, trainMonth, feature.fn);

    const fScores = [];
    const resultsForAvg = [];

    for (let range of ranges) {
      const corrCandles = months[range.name];

      const { results, predicted } = await mlXGClass.predict(runConfig, booster, corrCandles, feature.fn);
      predictions[range.name][feature.name] = predicted;

      if (!range.isTrain) {
        fScores.push(results.clasifResults.fScore);
        resultsForAvg.push(results);
      }

      // logConsole(range.name, results); // let's skip for now, too much noise
      await logFile(fileName, runConfig, coin.toString(), range.name, feature.name, results);
    }

    // log.end(runConfigXG.getName(runConfig), true); // let's skip for now, too much noise

    booster.free();

    const avgResults = runUtils.calcAvgResults(resultsForAvg);
    logConsole("AVG", avgResults);
    await logFile(fileName, runConfig, Coins.BTC, "AVG", feature.name, avgResults);

    return sum(fScores) / fScores.length; // TODO: fix for reg
  };

  const genetic = new GACore({ config: gaConfig, gaOpts: GAOpts.XG, userData, fnFitness });
  genetic.evolve();

  return {
    coin: months.Jul,
    months: {},
    labelsPredicted: [],
    linRegs
  };
};
