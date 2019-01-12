import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";
import * as runUtils from "./runUtils";

import * as calcCrossoverProb from "../corr/calcCrossoverProb";

export const runIndProb = async (): Promise<RunResult> => {
  const linRegs: LinRegResult[] = [];
  const predictions = runUtils.getPredictionsTemplate();

  const ranges = runUtils.genRanges_JunDec();
  // const ranges = runUtils.genRanges_SepWeek();
  // const ranges = runUtils.genRangesLast3_JunJulAugSep();
  const months = queryCorrCandlesMonthsBatched(Coins.BTC, ranges, true);
  await calcCrossoverProb.cProb(months, ranges);

  return {
    coin: months[ranges[0].name],
    labelsPredicted: predictions.Jul["vixFix480"] || [],
    linRegs
  };
};
