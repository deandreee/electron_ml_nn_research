import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonths } from "./queryCorrCandlesMonths";
import * as daterange from "../daterange";
import { round2 } from "../utils";
import * as log from "../log";
import { padEnd } from "lodash";

// @ts-ignore
import * as mlXG from "../mlXG";
import { FeatureSplit } from "../features";

export const runXG_UI = async (): Promise<RunResult> => {
  // const ranges = [daterange.SepWeek];
  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug, daterange.Sep];
  const ranges = [daterange.Aug, daterange.Oct];
  // const ranges = [daterange.Sep];
  const months = queryCorrCandlesMonths(Coins.BTC, ranges);
  const trainMonth = months[ranges[0].name];

  const linRegs: LinRegResult[] = [];

  const features: FeatureSplit[] = [
    // { name: "rsi_combo", fn: x => [x.ind.rsi30x10, x.ind.rsi60x10, x.ind.rsi120x10, x.ind.rsi240x10, x.ind.rsi480x10] }
    // {
    //   name: "rsi_combo_macd",
    //   fn: x => [
    //     x.ind.rsi30x10,
    //     x.ind.rsi60x10,
    //     x.ind.rsi120x10,
    //     x.ind.rsi240x10,
    //     x.ind.rsi480x10,
    //     x.ind.macd30.histo,
    //     x.ind.macd60.histo,
    //     x.ind.macd120.histo,
    //     x.ind.macd240.histo
    //   ]
    // }
    {
      name: "rsi_combo_macd_bbands",
      fn: x => [
        x.ind.rsi.x30.p10,
        x.ind.rsi.x60.p10,
        x.ind.rsi.x120.p10,
        x.ind.rsi.x240.p10,
        x.ind.rsi.x480.p10,
        x.ind.macd.x30.sig9.histo,
        x.ind.macd.x60.sig9.histo,
        x.ind.macd.x120.sig9.histo,
        x.ind.macd.x240.sig9.histo
      ]
    }
  ];

  for (let x of features) {
    log.start(x.name);

    const { booster } = await mlXG.train(trainMonth, x.fn);

    for (let range of ranges) {
      const corrCandles = months[range.name];
      const { r2, evalCorr, labels, predicted } = await mlXG.predict(booster, corrCandles, x.fn);

      console.log(
        padEnd(range.name, 10),
        padEnd("R2", 8),
        padEnd(round2(r2).toString(), 5),
        padEnd(round2(evalCorr.corr).toString(), 5)
      );

      linRegs.push({
        // x: features.map(x => x[0]),
        // y: labels,
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
    coin: trainMonth,
    labelsPredicted,
    linRegs
  };
};
