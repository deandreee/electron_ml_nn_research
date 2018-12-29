import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";

import * as mlXGClass from "../ml/mlXGClass";
// import * as mlXGClass from "../ml/mlXGClassProb";
import * as features from "../features";
import * as runUtils from "./runUtils";
import * as runConfigXG from "./runConfigXG";

import { logConsole, logFile } from "./logClassResults";
import * as log from "../log";

import { CustomGenetic, gaConfig, userData } from "./geneticAlgo2";

const featureName = "combo_single_each";
const fileName = `output/runBatchedXG_wGA/${featureName}_[lbl=${runConfigXG.TRIPPLE_BARRIER_LABEL}].csv`;
const coin = Coins.BTC;

export const runBatchedXG = async (): Promise<RunResult> => {
  const ranges = runUtils.genRanges_FastMiniTest();
  const months = queryCorrCandlesMonthsBatched(coin, ranges);
  const trainMonth = months[ranges[0].name];

  const linRegs: LinRegResult[] = [];
  const predictions = runUtils.getPredictionsTemplate();

  const feature = features.getCombo().find(x => x.name === featureName);

  const fnFitness = async (runConfig: runConfigXG.RunConfigXG) => {
    log.start(runConfigXG.getName(runConfig), true);

    const { booster } = await mlXGClass.train(runConfig, trainMonth, feature.fn);

    const allResults = [];
    for (let range of ranges) {
      const corrCandles = months[range.name];

      const { results, predicted } = await mlXGClass.predict(booster, corrCandles, feature.fn);
      predictions[range.name][feature.name] = predicted;
      allResults.push(results);

      logConsole(range.name, results);
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

    log.end(runConfigXG.getName(runConfig), true);

    booster.free();

    return allResults[1].fScore;
  };

  const genetic = new CustomGenetic(gaConfig, userData, fnFitness);
  genetic.evolve();

  return {
    coin: months.Jul,
    labelsPredicted: predictions.Jul["vixFix480"] || [],
    linRegs
  };
};
