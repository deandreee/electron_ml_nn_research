import { CorrCandleMonths } from "../run/queryCorrCandlesMonths";
import { DateRange } from "../daterange";
import { getInd, ps } from "../features/getKST";
import { timeframes } from "../features/common";
import { loop } from "./common";
import { KSTValue } from "../indicators/KST";
import { RunConfig } from "../run/runConfig";

export const calcProb = async (runConfig: RunConfig, months: CorrCandleMonths, ranges: DateRange[]) => {
  const corrCandles = months[ranges[0].name];

  loop(runConfig, corrCandles, timeframes, ps, getInd, (curr, prev, indCurr, indPrev) => {
    indCurr = indCurr as KSTValue;
    indPrev = indPrev as KSTValue;

    // buy
    return indCurr.kst > indCurr.signal;
  });
};
