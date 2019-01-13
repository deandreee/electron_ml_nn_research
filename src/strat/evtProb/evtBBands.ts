import { CorrCandleMonths } from "../run/queryCorrCandlesMonths";
import { DateRange } from "../daterange";
import { getInd, ps } from "../features/getBBands";
import { timeframes } from "../features/common";
import { loop } from "./common";
import { UpperLowerValue } from "../types";

export const calcProb = async (months: CorrCandleMonths, ranges: DateRange[]) => {
  const corrCandles = months[ranges[0].name];

  loop(corrCandles, timeframes, ps, getInd, (curr, prev, indCurr, indPrev) => {
    indCurr = indCurr as UpperLowerValue;
    indPrev = indPrev as UpperLowerValue;

    // hit lower
    return curr.close < indCurr.lower;
  });
};
