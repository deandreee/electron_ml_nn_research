import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";
import * as runUtils from "./runUtils";

// import * as calcCrossoverProb from "../corr/calcCrossoverProb";
import { calcProb } from "../evtProb/evtBBands";
// import { probsOCC } from "../evtProb/evtOCC";
// import { calcProb } from "../evtProb/evtKeltner";
// import { calcProb } from "../evtProb/evtChandelier";
// import { calcProb } from "../evtProb/evtKST";

export const runIndProb = async (): Promise<RunResult> => {
  const linRegs: LinRegResult[] = [];
  const predictions = runUtils.getPredictionsTemplate();

  const ranges = runUtils.genRanges_JunDec();
  // const ranges = runUtils.genRanges_SepWeek();
  // const ranges = runUtils.genRangesLast3_JunJulAugSep();
  // TODO: add required
  const months = queryCorrCandlesMonthsBatched(Coins.BTC, ranges, [] as any[], { prob: true });

  await calcProb(months, ranges);

  return {
    coin: months[ranges[0].name],
    labelsPredicted: predictions.Jul["vixFix480"] || [],
    linRegs
  };
};
