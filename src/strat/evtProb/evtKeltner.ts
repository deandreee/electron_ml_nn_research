import { CorrCandleMonths } from "../db/queryCorrCandlesMonths";
import { DateRange } from "../daterange";
import { getInd, ps } from "../features/getKeltner";
import { logTrippleBarrierStats, createProbsObj, formatTP, logProbs, TPB_LABELS, getLookAhead } from "./common";
import { timeframes } from "../features/common";
import { RunConfig } from "../run/config/runConfig";

// almost identical to BBands ...

export const calcProb = async (runConfig: RunConfig, months: CorrCandleMonths, ranges: DateRange[]) => {
  const probs = createProbsObj(timeframes, ps);

  const corrCandles = months[ranges[0].name];
  logTrippleBarrierStats(corrCandles);

  for (let t of timeframes) {
    for (let p of ps) {
      for (let lbl of TPB_LABELS) {
        for (let i = 1; i < corrCandles.candlesActual.length; i++) {
          const curr = corrCandles.candlesActual[i];
          // const prev = corrCandles.candlesActual[i - 1];

          const indCurr = getInd(curr, t, p);
          // const indPrev = getInd(prev, t, p);

          // hit lower
          // if (prev.close > indPrev.lower && curr.close < indCurr.lower) {
          if (curr.close < indCurr.lower) {
            // because of lookAhead cooldown, don't have to compare anymore
            probs[formatTP(lbl, t, p)][curr.pctChange.trippleBarriers[lbl]]++;

            i += getLookAhead(runConfig, lbl); // should be more fair
          }
        }
      }
    }
  }

  logProbs(probs, timeframes, ps);
};
