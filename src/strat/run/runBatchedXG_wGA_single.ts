import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";

// import * as mlXGClass from "../ml/mlXGClass";
import * as mlXGClass from "../ml/mlXGClassProb"; // !!! I think prob makes more sense with this
import * as features from "../features";
import * as runUtils from "./runUtils";
import * as runConfigXG from "./runConfigXG";

import { logConsole, logFile } from "./logClassResults";
// import * as log from "../log";

import { gaConfig, userData } from "./geneticAlgo2";
import { sum } from "lodash";
import { GeneticMACD, GA_MACD } from "./gaMACD";
// import { GeneticKalman, GA_Kalman } from "./gaKalman";

const t = "x480";
const feature: features.FeatureSplit = {
  name: `macd.${t}.opt`,
  fn: (x, i, corrCandles) => [x.ind.macd[t].opt.histo]
};

// const t = "x240";
// const feature: features.FeatureSplit = {
//   name: `kalman.${t}.opt`,
//   fn: (x, i, corrCandles) => [
//     x.ind.kalman[t].opt,
//     x.ind.kalman[t].opt - corrCandles.getPrev(i, 3).ind.kalman[t].opt, // 30m
//     x.ind.kalman[t].opt - corrCandles.getPrev(i, 6).ind.kalman[t].opt, // 1h
//     x.ind.kalman[t].opt - corrCandles.getPrev(i, 6 * 3).ind.kalman[t].opt, // 3h
//     x.ind.kalman[t].opt - corrCandles.getPrev(i, 6 * 6).ind.kalman[t].opt,
//     x.ind.kalman[t].opt - corrCandles.getPrev(i, 6 * 12).ind.kalman[t].opt,
//     x.ind.kalman[t].opt - corrCandles.getPrev(i, 6 * 24).ind.kalman[t].opt,
//     x.ind.kalman[t].opt - corrCandles.getPrev(i, 6 * 24 * 3).ind.kalman[t].opt, // 3d
//     x.ind.kalman[t].opt - x.close
//   ]
// };

const fileName = `output/runBatchedXG_wGA_single/${feature.name}_[lbl=${runConfigXG.BARRIER_LABEL}].csv`;
const coin = Coins.BTC;

const runConfig = runConfigXG.runConfigXGDef;

const linRegs: LinRegResult[] = [];
const predictions = runUtils.getPredictionsTemplate();

export const runBatchedXG = async (): Promise<RunResult> => {
  const ranges = runUtils.genRangesLast3_JunJulAugSep();
  // const ranges = runUtils.genRanges_FastMiniTest();

  const fnFitness = async (gaOpts: GA_MACD) => {
    // log.start(runConfigXG.getName(runConfig), true); // let's skip for now, too much noise

    const months = queryCorrCandlesMonthsBatched(coin, ranges, [feature], { ga: gaOpts, skipLog: true });
    const trainMonth = months[ranges[0].name];

    const { booster } = await mlXGClass.train(runConfig, trainMonth, feature.fn);

    const fScores = [];
    const resultsForAvg = [];

    for (let range of ranges) {
      const corrCandles = months[range.name];

      const { results } = await mlXGClass.predict(booster, corrCandles, feature.fn);

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

  const genetic = new GeneticMACD(gaConfig, userData, fnFitness);
  genetic.evolve();

  return {
    coin: {} as any,
    labelsPredicted: predictions.Jul["vixFix480"] || [],
    linRegs
  };
};
