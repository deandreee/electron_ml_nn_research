import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";

import { round2 } from "../utils";
import { padEnd } from "lodash";
import * as log from "../log";

// import * as mlXGClass from "../ml/mlXGClass";
import * as mlXGClass from "../ml/mlXGClassProb";
import * as features from "../features";
import * as runUtils from "./runUtils";

export const runBatchedXG = async (): Promise<RunResult> => {
  const ranges = runUtils.genRangesLast3_JunJulAugSep();
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
    // const fileName = "output/temp.csv";
    // const fileName = "output/xg_7d_all_EOS.csv";
    // const fileName = "output/xg_7d_all_BTC_REAL.csv";
    // const fileName = "output/xg_10d_rsi_BTC_REAL.csv";
    const { booster } = await mlXGClass.train(trainMonth, x.fn);

    for (let range of ranges) {
      const corrCandles = months[range.name];

      // console.log(
      //   padEnd(range.name, 10),
      //   padEnd(new Date(corrCandles.candlesActual[0].start * 1000).toISOString()),
      //   padEnd(new Date(corrCandles.candlesActual[corrCandles.candlesActual.length - 1].start * 1000).toISOString())
      // );

      const { results, predicted } = await mlXGClass.predict(booster, corrCandles, x.fn);
      predictions[range.name][x.name] = predicted;

      console.log(
        padEnd(range.name, 10),
        padEnd(round2(results.precisionTotal).toString(), 5),
        padEnd(round2(results.recallTotal).toString(), 5),
        padEnd(round2(results.fScore).toString(), 5)
      );
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
