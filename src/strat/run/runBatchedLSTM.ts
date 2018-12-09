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
import { round2 } from "../utils";
import * as log from "../log";
// @ts-ignore
import { padEnd, maxBy, minBy } from "lodash";

// import * as mlLSTMNeatapticClass from "../ml/mlLSTMNeatapticClass";
import * as mlLSTMSynapticClass from "../ml/mlLSTMSynapticClass";
import * as features from "../features";
import * as runUtils from "./runUtils";

/*    THIS IS NOT WORKING TOO WELL, ALWAYS PREDICTS 1    */

export const runBatchedLSTM = async (): Promise<RunResult> => {
  // const ranges = [daterange.SepWeek];
  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug, daterange.Sep];
  const ranges = [
    // daterange.JunJulAugSep,
    daterange.Jun,
    daterange.Jul
    // daterange.Aug,
    // daterange.Sep,
    // daterange.Oct,
    // daterange.Nov
  ];
  // const ranges = [daterange.JunJul, daterange.Aug];
  // const ranges = [daterange.JunJul, daterange.Aug, daterange.Sep, daterange.Oct];
  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug];
  const months = queryCorrCandlesMonthsBatched(Coins.BTC, ranges);

  const trainMonth = months[ranges[0].name];

  const linRegs: LinRegResult[] = [];
  const predictions = runUtils.getPredictionsTemplate();

  const featuresSplit = features.getCombo();
  // const featuresSplit = features.getMFI();
  for (let x of featuresSplit) {
    log.start(x.name);
    // const fileName = "output/temp.csv";
    // const fileName = "output/xg_7d_all_EOS.csv";
    // const fileName = "output/xg_7d_all_BTC_REAL.csv";
    // const fileName = "output/xg_10d_rsi_BTC_REAL.csv";
    const { net } = await mlLSTMSynapticClass.train(trainMonth, x.fn);

    for (let range of ranges) {
      const corrCandles = months[range.name];

      // console.log(
      //   padEnd(range.name, 10),
      //   padEnd(new Date(corrCandles.candlesActual[0].start * 1000).toISOString()),
      //   padEnd(new Date(corrCandles.candlesActual[corrCandles.candlesActual.length - 1].start * 1000).toISOString())
      // );

      const { results, predicted } = await mlLSTMSynapticClass.predict(net, corrCandles, x.fn);
      predictions[range.name][x.name] = predicted;

      console.log(
        padEnd(range.name, 10),
        padEnd(round2(results.precisionTotal).toString(), 5),
        padEnd(round2(results.recallTotal).toString(), 5),
        padEnd(round2(results.fScore).toString(), 5)
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
