import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonths } from "./queryCorrCandlesMonths";
import * as daterange from "../daterange";

import { round2 } from "../utils";
import * as log from "../log";
import { padEnd } from "lodash";

import * as mlXGClass from "../ml/mlXGClass";
import * as features from "../features";
import { runConfigXG } from "./runConfigXG";

export const runXGClass = async (): Promise<RunResult> => {
  // const ranges = [daterange.SepWeek];
  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug, daterange.Sep];
  const ranges = [daterange.JunJul, daterange.Jun, daterange.Jul, daterange.Aug, daterange.Sep, daterange.Oct];
  // const ranges = [daterange.JunJul, daterange.Aug];
  // const ranges = [daterange.JunJul, daterange.Aug, daterange.Sep, daterange.Oct];
  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug];
  const months = queryCorrCandlesMonths(Coins.BTC, ranges);
  const trainMonth = months[ranges[0].name];

  const linRegs: LinRegResult[] = [];

  const featuresSplit = features.getBBands();
  for (let x of featuresSplit) {
    log.start(x.name);
    // const fileName = "output/temp.csv";
    // const fileName = "output/xg_7d_all_EOS.csv";
    // const fileName = "output/xg_7d_all_BTC_REAL.csv";
    // const fileName = "output/xg_10d_rsi_BTC_REAL.csv";
    const { booster } = await mlXGClass.train(runConfigXG, trainMonth, x.fn);

    for (let range of ranges) {
      const corrCandles = months[range.name];
      const { results } = await mlXGClass.predict(booster, corrCandles, x.fn);

      console.log(padEnd(range.name, 10), padEnd("R2", 8), padEnd(round2(results.fScore).toString(), 5));
    }

    booster.free();

    log.end(x.name);
  }

  const labelsPredicted: number[] = [];

  return {
    coin: trainMonth,
    labelsPredicted,
    linRegs
  };
};
