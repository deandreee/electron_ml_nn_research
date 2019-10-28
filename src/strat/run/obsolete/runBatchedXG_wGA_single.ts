import { Coins, RunResult, LinRegResult } from "../../types";
import { queryCorrCandlesMonthsBatched } from "../queryCorrCandlesMonths";
// import { calcIndicators, queryCandlesBatched } from "./queryCorrCandlesMonths";

import * as mlXGClass from "../../ml/mlXGClass";
import * as features from "../../features";
import * as runUtils from "../runUtils";
import { runConfig } from "../runConfig";

import { logConsole, logFile, logFileHeader } from "../../log/logResults";
// import * as log from "../log";

import { sum } from "lodash";
import { TimeFrame } from "../../features/common";

import { gaConfig, userData, GAEntity } from "../ga/common";
import { GACore } from "../ga/GACore";
import * as GAOpts from "../ga/GAOpts";

// const gaOpts = GAOpts.MACD;
// const t: TimeFrame = "x1440";
// const feature: features.FeatureSplit = {
//   name: `macd.${t}.opt`,
//   fn: (x, i, corrCandles) => [x.ind.macd[t].opt.histo]
// };

// const gaOpts = GAOpts.VixFix;
// const t: TimeFrame = "x120";
// const feature: features.FeatureSplit = {
//   name: `vixFix.${t}.opt`,
//   fn: (x, i, corrCandles) => [x.ind.vixFix[t].opt]
// };

const gaOpts = GAOpts.KST;
const t: TimeFrame = "x1440";
const feature: features.FeatureSplit = {
  name: `kst.${t}.opt`,
  fn: (x, i, corrCandles) => [x.ind.kst[t].opt.kst]
};

// const gaOpts = GAOpts.Kalman;
// const t: TimeFrame = "x1440";
// const feature: features.FeatureSplit = {
//   name: `kalman.${t}.opt`,
//   fn: (x, i, corrCandles) => [
//     x.ind.kalman[t].opt,
//     x.ind.kalman[t].opt - corrCandles.getPrev(i, 3).ind.kalman[t].opt, // 30m
//     x.ind.kalman[t].opt - corrCandles.getPrev(i, 6).ind.kalman[t].opt, // 1h
//     x.ind.kalman[t].opt - corrCandles.getPrev(i, 6 * 3).ind.kalman[t].opt, // 3h
//     x.ind.kalman[t].opt - corrCandles.getPrev(i, 6 * 6).ind.kalman[t].opt,
//     x.ind.kalman[t].opt - corrCandles.getPrev(i, 6 * 12).ind.kalman[t].opt,
//     x.ind.kalman[t].opt - corrCandles.getPrev(i, 6 * 24).ind.kalman[t].opt,
//     x.ind.kalman[t].opt - corrCandles.getPrev(i, 6 * 24 * 3).ind.kalman[t].opt, // 3d
//     x.ind.kalman[t].opt - x.close
//   ]
// };

const fileName = `output/runBatchedXG_wGA_single/${feature.name}_[lbl=${runConfig.BARRIER_LABEL}].csv`;
const coin = Coins.BTC;

const linRegs: LinRegResult[] = [];

export const runBatchedXG = async (): Promise<RunResult> => {
  const ranges = runUtils.genRanges_JJAS();
  // const ranges = runUtils.genRanges_FastMiniTest();

  // console.time("queryCandlesBatched");
  // const candleMonths = queryCandlesBatched(coin, ranges);
  // console.timeEnd("queryCandlesBatched");

  await logFileHeader(fileName, runConfig);

  const fnFitness = async (gaEntity: GAEntity) => {
    // log.start(runConfigXG.getName(runConfig), true); // let's skip for now, too much noise

    // console.time("clone");
    // const candleMonthsCloned = cloneDeep(candleMonths);
    // // console.timeEnd("clone");
    // process.stdout.write("C");

    // // console.time("ind");
    // const months = calcIndicators(candleMonthsCloned, ranges, [feature], { ga: gaEntity, skipLog: true });
    // // console.timeEnd("ind");
    // process.stdout.write("I");

    const months = queryCorrCandlesMonthsBatched(runConfig, coin, ranges, [feature], {
      ga: gaEntity,
      skipLog: true
    });
    // process.stdout.write("T");

    const trainMonth = months[ranges[0].name];

    // console.time("train");
    const { booster } = await mlXGClass.train(runConfig, trainMonth, feature.fn);
    // console.timeEnd("train");

    process.stdout.write("T");

    const fScores = [];
    const resultsForAvg = [];

    for (let range of ranges) {
      const corrCandles = months[range.name];

      // console.time("predict");
      const { results } = await mlXGClass.predict(runConfig, booster, corrCandles, feature.fn);
      // console.timeEnd("predict");

      if (!range.isTrain) {
        fScores.push(results.clasifResults.fScore);
        resultsForAvg.push(results);
      }

      // logConsole(range.name, results); // let's skip for now, too much noise
      await logFile(fileName, runConfig, coin.toString(), range.name, feature.name, results, gaEntity);
    }

    process.stdout.write("P");

    // log.end(runConfigXG.getName(runConfig), true); // let's skip for now, too much noise

    booster.free();

    const avgResults = runUtils.calcAvgResults(resultsForAvg);
    logConsole("AVG", avgResults);
    await logFile(fileName, runConfig, Coins.BTC, "AVG", feature.name, avgResults, gaEntity);

    return sum(fScores) / fScores.length; // TODO: need to solve for reg ...
  };

  const genetic = new GACore({ config: gaConfig, gaOpts, userData, fnFitness });
  genetic.evolve();

  return {
    coin: {} as any,
    months: {},
    labelsPredicted: [],
    linRegs
  };
};
