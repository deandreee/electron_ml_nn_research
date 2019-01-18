import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";

import * as mlXGClass from "../ml/mlXGClass";
// import * as mlXGClass from "../ml/mlXGClassProb";
import * as features from "../features";
import * as runUtils from "./runUtils";
import * as runConfigXG from "./runConfigXG";

import { logConsole, logFile } from "./logClassResults";
// import * as log from "../log";

import { CustomGenetic, gaConfig, userData } from "./geneticAlgo2";
import { sum } from "lodash";
import { runConfigXG2 } from "./runConfigXG";

const featureName = "x120.vixFix.a";
const feature = features.getVixFix().find(x => x.name === featureName);
const fileName = `output/runBatchedXG_wGA/${featureName}_[lbl=${runConfigXG.TRIPPLE_BARRIER_LABEL}].csv`;
const coin = Coins.BTC;

export const runBatchedXG = async (): Promise<RunResult> => {
  const ranges = runUtils.genRanges_TrainJunJul();
  const months = queryCorrCandlesMonthsBatched(coin, ranges, [feature]);
  const trainMonth = months[ranges[0].name];

  const linRegs: LinRegResult[] = [];
  const predictions = runUtils.getPredictionsTemplate();

  const fnFitness = async (runConfig: runConfigXG.RunConfigXG) => {
    // log.start(runConfigXG.getName(runConfig), true); // let's skip for now, too much noise

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
      await logFile(
        fileName,
        runConfig,
        coin.toString(),
        range.name,
        runConfigXG.TRIPPLE_BARRIER_LABEL,
        feature.name,
        results
      );
    }

    // log.end(runConfigXG.getName(runConfig), true); // let's skip for now, too much noise

    booster.free();

    const avgResults = runUtils.calcAvgResults(resultsForAvg);
    logConsole("AVG", avgResults);
    await logFile(
      fileName,
      runConfigXG2,
      Coins.BTC,
      "AVG",
      runConfigXG.TRIPPLE_BARRIER_LABEL,
      feature.name,
      avgResults
    );

    return sum(fScores) / fScores.length;
  };

  const genetic = new CustomGenetic(gaConfig, userData, fnFitness);
  genetic.evolve();

  return {
    coin: months.Jul,
    labelsPredicted: predictions.Jul["vixFix480"] || [],
    linRegs
  };
};
