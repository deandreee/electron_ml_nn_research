import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonths } from "./queryCorrCandlesMonths";
import * as daterange from "../daterange";

import * as csvLog from "../csvLog";
import { getFeaturesSplit } from "../mlGetFeatures";
import { round2 } from "../utils";
import { LABEL_NAME } from "../mlGetLabels";
import * as log from "../log";
import { padEnd } from "lodash";

// @ts-ignore
import * as mlXG from "../mlXG";

export const runXG = async (): Promise<RunResult> => {
  // const ranges = [daterange.SepWeek];
  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug, daterange.Sep];
  const ranges = [daterange.Aug, daterange.Oct];
  // const ranges = [daterange.JunJul, daterange.Aug];
  // const ranges = [daterange.JunJul, daterange.Aug, daterange.Sep, daterange.Oct];
  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug];
  const months = queryCorrCandlesMonths(Coins.BTC, ranges);
  const trainMonth = months[ranges[0].name];

  const linRegs: LinRegResult[] = [];

  const featuresSplit = getFeaturesSplit();
  for (let x of featuresSplit) {
    log.start(x.name);
    // const fileName = "output/temp.csv";
    // const fileName = "output/xg_7d_all_EOS.csv";
    // const fileName = "output/xg_7d_all_BTC_REAL.csv";
    const fileName = "output/xg_10d_rsi_BTC_REAL.csv";
    const { booster } = await mlXG.train(trainMonth, x.fn);

    for (let range of ranges) {
      const corrCandles = months[range.name];
      const { mse, r2, evalCorr, labels, predicted } = await mlXG.predict(booster, corrCandles, x.fn);
      await csvLog.append(fileName, [
        new Date().toISOString(),
        corrCandles.coin.name,
        range.name,
        LABEL_NAME,
        x.name,
        round2(mse),
        round2(r2),
        round2(evalCorr.corr),
        round2(evalCorr.r2)
      ]);

      console.log(
        padEnd(range.name, 10),
        padEnd("R2", 8),
        padEnd(round2(r2).toString(), 5),
        padEnd(round2(evalCorr.corr).toString(), 5)
      );

      linRegs.push({
        x: labels,
        y: predicted,
        regEquation: [],
        r2,
        corr: evalCorr.corr,
        name: range.name
      });
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
