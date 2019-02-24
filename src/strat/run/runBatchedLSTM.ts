import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";
import * as daterange from "../daterange";

import * as log from "../log";

// import * as mlLSTM from "../ml/mlLSTMNeatapticClass";
// import * as mlLSTM from "../ml/mlLSTMSynapticClass";
import * as mlLSTM from "../ml/mlLSTMTF";
import * as features from "../features";
import * as runUtils from "./runUtils";
import { logConsole } from "../log/logResults";
import { runConfig } from "./runConfig";

/*    THIS IS NOT WORKING TOO WELL, ALWAYS PREDICTS 1    */

export const runBatchedLSTM = async (): Promise<RunResult> => {
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

  const featuresSplit = features.getCombo();
  // const featuresSplit = features.getTest();
  // const featuresSplit = features.getVixFix();
  // const featuresSplit = features.getMFI();

  const months = queryCorrCandlesMonthsBatched(runConfig, Coins.BTC, ranges, featuresSplit);

  const trainMonth = months[ranges[0].name];

  const linRegs: LinRegResult[] = [];
  const predictions = runUtils.getPredictionsTemplate();

  for (let x of featuresSplit) {
    log.start(x.name);

    const { net, minMaxScaler } = await mlLSTM.train(runConfig, trainMonth, x.fn);

    for (let range of ranges) {
      const corrCandles = months[range.name];

      const { results, predicted } = await mlLSTM.predict(runConfig, net, corrCandles, x.fn, minMaxScaler);
      predictions[range.name][x.name] = predicted;

      logConsole(range.name, { clasifResults: results }); // hardcoded for now
    }

    log.end(x.name);
  }

  return {
    coin: months.Jul,
    months,
    labelsPredicted: [],
    linRegs
  };
};
