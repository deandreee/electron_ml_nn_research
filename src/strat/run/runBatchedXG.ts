import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";
import * as daterange from "../daterange";

// @ts-ignore
import * as csvLog from "../csvLog";
// @ts-ignore
import * as csvLogger from "../csvLogger";
// @ts-ignore
import * as csvLogPredictions from "../csvLogPredictions";
// @ts-ignore
import { getFeaturesSplit, FeatureSplit } from "../mlGetFeatures";
// @ts-ignore
import { round2 } from "../utils";
// @ts-ignore
import { linregFX } from "../linreg";
// @ts-ignore
import { LABEL_NAME } from "../mlGetLabels";
import * as log from "../log";
// @ts-ignore
import { padEnd } from "lodash";

// @ts-ignore
import * as mlXG from "../mlXG";
import * as mlXGClass from "../mlXGClass";

export const runBatchedXG = async (): Promise<RunResult> => {
  // const ranges = [daterange.SepWeek];
  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug, daterange.Sep];
  const ranges = [daterange.Jun, daterange.Jul, daterange.Aug, daterange.Sep, daterange.Oct];
  // const ranges = [daterange.JunJul, daterange.Aug];
  // const ranges = [daterange.JunJul, daterange.Aug, daterange.Sep, daterange.Oct];
  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug];
  const months = queryCorrCandlesMonthsBatched(Coins.BTC, ranges);

  const trainMonth = months[ranges[0].name];

  const linRegs: LinRegResult[] = [];

  const featuresSplit = getFeaturesSplit();
  for (let x of featuresSplit) {
    log.start(x.name);
    // const fileName = "output/temp.csv";
    // const fileName = "output/xg_7d_all_EOS.csv";
    // const fileName = "output/xg_7d_all_BTC_REAL.csv";
    // const fileName = "output/xg_10d_rsi_BTC_REAL.csv";
    const { booster } = await mlXGClass.train(trainMonth, x.fn);

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
    coins: { BTC: trainMonth.coin },
    labelsPredicted,
    linRegs
  };
};
