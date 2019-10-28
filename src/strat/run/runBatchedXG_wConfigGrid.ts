import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "../db/queryCorrCandlesMonths";

import * as mlXGClass from "../ml/mlXGClass";
// import * as mlXGClass from "../ml/mlXGClassProb";
import * as features from "../features";
import * as runUtils from "./utils/runUtils";
import { runConfig as runConfigBase } from "./config/runConfig";
import * as runConfigXG from "./config/runConfigXG";

import { logConsole, logFile } from "../log/logResults";
import * as log from "../log";

const featureName = "combo_single_each";
const fileName = `output/runBatchedXG_wConfigGrid/${featureName}_[lbl=${runConfigBase.BARRIER_LABEL}].csv`;
const coin = Coins.BTC;

export const runBatchedXG = async (): Promise<RunResult> => {
  const feature = features.getCombo().find(x => x.name === featureName);

  const ranges = runUtils.genRanges_JJAS();
  const months = queryCorrCandlesMonthsBatched(runConfigBase, coin, ranges, [feature]);
  const trainMonth = months[ranges[0].name];

  // runUtils.getIndMinMax(trainMonth);

  const linRegs: LinRegResult[] = [];
  const predictions = runUtils.getPredictionsTemplate();

  const xgConfigs = runConfigXG.getConfigGrid();
  console.log(`RUN CONFIGS ::: ${xgConfigs.length}`);

  for (let xg of xgConfigs) {
    log.start(runConfigXG.getName(xg));

    const runConfig = { ...runConfigBase, xg };

    const { booster } = await mlXGClass.train(runConfig, trainMonth, feature.fn);

    for (let range of ranges) {
      const corrCandles = months[range.name];

      const { results, predicted } = await mlXGClass.predict(runConfig, booster, corrCandles, feature.fn);
      predictions[range.name][feature.name] = predicted;

      logConsole(range.name, results);
      await logFile(fileName, runConfig, coin.toString(), range.name, feature.name, results);
    }

    log.end(runConfigXG.getName(xg));

    booster.free();
  }

  return {
    coin: months.Jul,
    months: {},
    labelsPredicted: [],
    linRegs
  };
};
