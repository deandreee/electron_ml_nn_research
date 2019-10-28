import { CorrCandleMonths } from "../db/queryCorrCandlesMonths";
import { DateRange } from "../daterange";
import { getInd, ps } from "../features/getEMAOCC";
import { timeframes } from "../features/common";
import { loop } from "./common";
import { RunConfig } from "../run/config/runConfig";

export const calcProb = async (runConfig: RunConfig, months: CorrCandleMonths, ranges: DateRange[]) => {
  const corrCandles = months[ranges[0].name];

  loop(runConfig, corrCandles, timeframes, ps, getInd, (curr, prev, indCurr, indPrev) => {
    indCurr = indCurr as number;
    indPrev = indPrev as number;

    // crossover
    return indCurr > 0;
  });
};
