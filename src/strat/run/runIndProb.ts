import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "../db/queryCorrCandlesMonths";
import * as runUtils from "./utils/runUtils";
import { runConfig } from "./config/runConfig";

// import * as calcCrossoverProb from "../corr/calcCrossoverProb";
import { calcProb } from "../evtProb/evtBBands";
// import { probsOCC } from "../evtProb/evtOCC";
// import { calcProb } from "../evtProb/evtKeltner";
// import { calcProb } from "../evtProb/evtChandelier";
// import { calcProb } from "../evtProb/evtKST";

export const runIndProb = async (): Promise<RunResult> => {
  const linRegs: LinRegResult[] = [];

  const ranges = runUtils.genRanges_FastMiniTest();
  // const ranges = runUtils.genRanges_JunDec();
  // const ranges = runUtils.genRanges_SepWeek();
  // const ranges = runUtils.genRangesLast3_JunJulAugSep();
  // TODO: add required
  const months = queryCorrCandlesMonthsBatched(runConfig, Coins.BTC, ranges, [] as any[], { prob: true });

  await calcProb(runConfig, months, ranges);

  return {
    coin: months[ranges[0].name],
    months: {},
    labelsPredicted: [],
    linRegs
  };
};
