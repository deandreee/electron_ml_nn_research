import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";
import * as daterange from "../daterange";

import * as csvLog from "../csvLog";

// @ts-ignore
import { round2 } from "../utils";
import * as log from "../log";
// @ts-ignore
import { padEnd, maxBy, minBy } from "lodash";

// import * as mlLSTM from "../ml/mlLSTMNeatapticClass";
// import * as mlLSTM from "../ml/mlLSTMSynapticClass";
import * as mlLSTM from "../ml/mlLSTMTF";
import * as features from "../features";
import * as runUtils from "./runUtils";
import { EvalResults } from "../ml/mlEvaluate";

/*    THIS IS NOT WORKING TOO WELL, ALWAYS PREDICTS 1    */

export const runBatchedLSTM = async (): Promise<RunResult> => {
  // const ranges = [daterange.SepWeek];
  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug, daterange.Sep];
  const ranges = [
    // daterange.JunJulAugSep,
    // daterange.Aug, // bad bad results, everything goes to single label
    daterange.JunJul, // also good balance

    daterange.Jun,
    daterange.Jul, // more balanced

    daterange.Aug,
    daterange.Sep,
    daterange.Oct,
    daterange.Nov
  ];
  // const ranges = [daterange.JunJul, daterange.Aug];
  // const ranges = [daterange.JunJul, daterange.Aug, daterange.Sep, daterange.Oct];
  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug];
  const months = queryCorrCandlesMonthsBatched(Coins.BTC, ranges);

  const trainMonth = months[ranges[0].name];

  const linRegs: LinRegResult[] = [];
  const predictions = runUtils.getPredictionsTemplate();

  const featuresSplit = features.getCombo();
  // const featuresSplit = features.getTest();
  // const featuresSplit = features.getVixFix();
  // const featuresSplit = features.getMFI();
  for (let x of featuresSplit) {
    log.start(x.name);
    // const fileName = "output/temp.csv";
    // const fileName = "output/xg_7d_all_EOS.csv";
    // const fileName = "output/xg_7d_all_BTC_REAL.csv";
    // const fileName = "output/xg_10d_rsi_BTC_REAL.csv";
    // const { net } = await mlLSTMSynapticClass.train(trainMonth, x.fn);
    const { net, minMaxScaler } = await mlLSTM.train(trainMonth, x.fn);

    for (let range of ranges) {
      const corrCandles = months[range.name];

      // console.log(
      //   padEnd(range.name, 10),
      //   padEnd(new Date(corrCandles.candlesActual[0].start * 1000).toISOString()),
      //   padEnd(new Date(corrCandles.candlesActual[corrCandles.candlesActual.length - 1].start * 1000).toISOString())
      // );

      const { results, predicted } = await mlLSTM.predict(net, corrCandles, x.fn, minMaxScaler);
      predictions[range.name][x.name] = predicted;

      console.log(
        padEnd(range.name, 10),
        padEnd(round2(results.precisionTotal).toString(), 5),
        padEnd(round2(results.recallTotal).toString(), 5),
        padEnd(round2(results.fScore).toString(), 5),
        padEnd(round2(results.hitRate).toString(), 5),
        padEnd(round2(results.bigErrorsReverse).toString(), 5),
        padEnd(results.zeroHitRate, 10),
        padEnd(results.oneHitRate, 10),
        padEnd(results.twoHitRate, 10)
      );
    }

    log.end(x.name);
  }

  return {
    coin: months.Jul,
    labelsPredicted: predictions.Jul["vixFix480"] || [],
    linRegs
  };
};

export const write = async (
  coinName: string,
  rangeName: string,
  labelName: string,
  featureName: string,
  results: EvalResults
) => {
  const fileName = "output/lstm_.csv";

  if (!csvLog.exists(fileName)) {
  }

  await csvLog.append(fileName, [
    new Date().toISOString(),
    coinName,
    rangeName,
    labelName,
    featureName,
    round2(results.precisionTotal),
    round2(results.recallTotal),
    round2(results.fScore),
    round2(results.hitRate),
    round2(results.bigErrorsReverse),
    results.zeroHitRate,
    results.oneHitRate,
    results.twoHitRate
  ]);
};
