import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";

import * as mlXGClass from "../ml/mlXGClass";
// import * as mlXGClass from "../ml/mlXGClassProb";
import * as features from "../features";
import * as runUtils from "./runUtils";
import * as runConfigXG from "./runConfigXG";

import { logConsole, logFile } from "./logClassResults";
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

const featureName = "emaOCC.vixFix.kst2.lrc.mfi.chandelierExit.t3Macd.bbands.rsi";
const feature = features.getValidationFive().find(x => x.name === featureName);

const fileName = `output/runBatchedXG_wGA/${featureName}_[lbl=${runConfigXG.BARRIER_LABEL}].csv`;
const coin = Coins.BTC;

export const runBatchedXG = async (): Promise<RunResult> => {
  const ranges = runUtils.genRanges_JJAS();
  const months = queryCorrCandlesMonthsBatched(runConfigXG.batchConfig, coin, ranges, [feature]);
  const trainMonth = months[ranges[0].name];

  const linRegs: LinRegResult[] = [];
  const predictions = runUtils.getPredictionsTemplate();

  const fnFitness = async (gaEntity: GAEntity) => {
    // log.start(runConfigXG.getName(runConfig), true); // let's skip for now, too much noise

    const runConfig = gaEntity as runConfigXG.RunConfigXG;

    const { booster } = await mlXGClass.train(runConfig, trainMonth, feature.fn);

    const fScores = [];
    const resultsForAvg = [];

    for (let range of ranges) {
      const corrCandles = months[range.name];

      const { results, predicted } = await mlXGClass.predict(booster, corrCandles, feature.fn);
      predictions[range.name][feature.name] = predicted;

      if (!range.isTrain) {
        fScores.push(results.fScore);
        resultsForAvg.push(results);
      }

      // logConsole(range.name, results); // let's skip for now, too much noise
      await logFile(fileName, runConfig, coin.toString(), range.name, runConfigXG.BARRIER_LABEL, feature.name, results);
    }

    // log.end(runConfigXG.getName(runConfig), true); // let's skip for now, too much noise

    booster.free();

    const avgResults = runUtils.calcAvgResults(resultsForAvg);
    logConsole("AVG", avgResults);
    await logFile(fileName, runConfig, Coins.BTC, "AVG", runConfigXG.BARRIER_LABEL, feature.name, avgResults);

    return sum(fScores) / fScores.length;
  };

  const genetic = new GACore({ config: gaConfig, gaOpts: GAOpts.XG, userData, fnFitness });
  genetic.evolve();

  return {
    coin: months.Jul,
    labelsPredicted: predictions.Jul["vixFix480"] || [],
    linRegs
  };
};
