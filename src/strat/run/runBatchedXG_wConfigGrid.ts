import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";

import * as mlXGClass from "../ml/mlXGClass";
// import * as mlXGClass from "../ml/mlXGClassProb";
import * as features from "../features";
import * as runUtils from "./runUtils";
import * as runConfigXG from "./runConfigXG";

import { logConsole, logFile } from "./logClassResults";
import * as log from "../log";

const featureName = "combo_single_each";
const fileName = `output/runBatchedXG_wConfigGrid/${featureName}.csv`;
const coin = Coins.BTC;

export const runBatchedXG = async (): Promise<RunResult> => {
  const ranges = runUtils.genRanges_TrainJunJul();
  const months = queryCorrCandlesMonthsBatched(coin, ranges);
  const trainMonth = months[ranges[0].name];

  runUtils.getIndMinMax(trainMonth);

  const linRegs: LinRegResult[] = [];
  const predictions = runUtils.getPredictionsTemplate();

  const feature = features.getCombo().find(x => x.name === featureName);

  const runConfigs = runConfigXG.getConfigGrid();

  for (let runConfig of runConfigs) {
    log.start(runConfigXG.getName(runConfig));

    const { booster } = await mlXGClass.train(runConfig, trainMonth, feature.fn);

    for (let range of ranges) {
      const corrCandles = months[range.name];

      const { results, predicted } = await mlXGClass.predict(booster, corrCandles, feature.fn);
      predictions[range.name][feature.name] = predicted;

      logConsole(range.name, results);
      await logFile(fileName, coin.toString(), range.name, "LABEL", feature.name, results);
    }

    log.end(runConfigXG.getName(runConfig));

    booster.free();
  }

  return {
    coin: months.Jul,
    labelsPredicted: predictions.Jul["vixFix480"] || [],
    linRegs
  };
};
