import { CorrCandleMonths } from "../run/queryCorrCandlesMonths";
import { DateRange } from "../daterange";
import { getInd, ps } from "../features/getBBands";
import { timeframes } from "../features/common";
import { loop } from "./common";
import { UpperLowerValue } from "../types";
import { RunConfig } from "../run/runConfig";

export const calcProb = async (runConfig: RunConfig, months: CorrCandleMonths, ranges: DateRange[]) => {
  const corrCandles = months[ranges[0].name];

  loop(runConfig, corrCandles, timeframes, ps, getInd, (curr, prev, indCurr, indPrev) => {
    indCurr = indCurr as UpperLowerValue;
    indPrev = indPrev as UpperLowerValue;

    // hit lower
    return curr.close < indCurr.lower;
  });
};
