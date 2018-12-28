import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";

import * as log from "../log";

import * as mlXGClass from "../ml/mlXGClass";
// import * as mlXGClass from "../ml/mlXGClassProb";
import * as features from "../features";
import * as runUtils from "./runUtils";
import { logConsole } from "./logClassResults";
import { runConfigXG } from "./runConfigXG";

export const runBatchedXG = async (): Promise<RunResult> => {
  const ranges = runUtils.genRanges_TrainJunJul();
  const months = queryCorrCandlesMonthsBatched(Coins.BTC, ranges);
  const trainMonth = months[ranges[0].name];

  runUtils.getIndMinMax(trainMonth);

  const linRegs: LinRegResult[] = [];
  const predictions = runUtils.getPredictionsTemplate();

  const featuresSplit = features.getCombo();
  // const featuresSplit = features.getTest();
  // const featuresSplit = features.getMFI();

  for (let x of featuresSplit) {
    log.start(x.name);
    const { booster } = await mlXGClass.train(runConfigXG, trainMonth, x.fn);

    for (let range of ranges) {
      const corrCandles = months[range.name];

      const { results, predicted } = await mlXGClass.predict(booster, corrCandles, x.fn);
      predictions[range.name][x.name] = predicted;

      logConsole(range.name, results);
    }

    booster.free();

    log.end(x.name);
  }

  return {
    coin: months.Jul,
    labelsPredicted: predictions.Jul["vixFix480"] || [],
    linRegs
  };
};
