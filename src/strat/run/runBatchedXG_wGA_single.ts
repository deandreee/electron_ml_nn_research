import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";

import * as mlXGClass from "../ml/mlXGClass";
// import * as mlXGClass from "../ml/mlXGClassProb";
import * as features from "../features";
import * as runUtils from "./runUtils";
import * as runConfigXG from "./runConfigXG";

import { logConsole, logFile } from "./logClassResults";
// import * as log from "../log";

import { gaConfig, userData } from "./geneticAlgo2";
import { sum } from "lodash";
import { GeneticMACD, GA_MACD } from "./gaMACD";

const feature: features.FeatureSplit = {
  name: `macd.x120.opt`,
  fn: (x, i, corrCandles) => [x.ind.macd.x120.opt.histo]
};

const fileName = `output/runBatchedXG_wGA_single/${feature.name}_[lbl=${runConfigXG.BARRIER_LABEL}].csv`;
const coin = Coins.BTC;

const runConfig = runConfigXG.runConfigXGDef;

const linRegs: LinRegResult[] = [];
const predictions = runUtils.getPredictionsTemplate();

export const runBatchedXG = async (): Promise<RunResult> => {
  const ranges = runUtils.genRangesLast3_JunJulAugSep();

  const fnFitness = async (gaOpts: GA_MACD) => {
    // log.start(runConfigXG.getName(runConfig), true); // let's skip for now, too much noise

    const months = queryCorrCandlesMonthsBatched(coin, ranges, [feature], gaOpts);
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
