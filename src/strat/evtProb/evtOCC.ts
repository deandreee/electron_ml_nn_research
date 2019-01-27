import { CorrCandleMonths } from "../run/queryCorrCandlesMonths";
import { DateRange } from "../daterange";
import { getInd, ps } from "../features/getEMAOCC";
import { timeframes } from "../features/common";
import { loop } from "./common";

export const calcProb = async (months: CorrCandleMonths, ranges: DateRange[]) => {
  const corrCandles = months[ranges[0].name];

  loop(corrCandles, timeframes, ps, getInd, (curr, prev, indCurr, indPrev) => {
    indCurr = indCurr as number;
    indPrev = indPrev as number;

    // crossover
    return indCurr > 0;
  });
};
