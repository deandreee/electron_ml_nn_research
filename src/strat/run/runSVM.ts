import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonths } from "../db/queryCorrCandlesMonths";

import * as csvLogPredictions from "../csvLogPredictions";
import { round2 } from "../utils";
import * as log from "../log";
import { padEnd } from "lodash";

import * as predict from "../ml/mlSVM";
import * as features from "../features";
import * as runUtils from "./utils/runUtils";

export const runSVM = async (): Promise<RunResult> => {
  const ranges = runUtils.genRanges_FastMiniTest();

  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug, daterange.Sep];
  const months = queryCorrCandlesMonths(Coins.BTC, ranges);
  const trainMonth = months[ranges[0].name];

  const linRegs: LinRegResult[] = [];

  const featuresSplit = features.getBBands();
  for (let x of featuresSplit) {
    for (let range of ranges) {
      log.start(x.name);

      const corrCandles = months[range.name];
      const { labels, predicted, r2 } = await predict.predictSvmRegression(corrCandles, x.fn);
      await csvLogPredictions.append("output/lbl_vs_pred.csv", labels, predicted);

      console.log(padEnd(range.name, 10), padEnd("R2", 8), round2(r2));

      linRegs.push({
        x: labels,
        y: predicted,
        regEquation: [],
        r2: 1,
        corr: 1,
        name: range.name
      });

      log.end(x.name);
    }
  }

  return {
    coin: trainMonth,
    months: {},
    labelsPredicted: [],
    linRegs
  };
};
