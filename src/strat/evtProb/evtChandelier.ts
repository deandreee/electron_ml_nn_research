import { CorrCandleMonths } from "../run/queryCorrCandlesMonths";
import { DateRange } from "../daterange";
import { getInd, timeframes, ps } from "../features/getChandelierExit";
import { logTrippleBarrierStats, createProbsObj, formatTP, logProbs, TPB_LABELS, getLookAhead } from "./common";

// almost identical to BBands ...

export const calcProb = async (months: CorrCandleMonths, ranges: DateRange[]) => {
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

          // go long basically
          if (curr.close > indCurr.exitShort) {
            probs[formatTP(lbl, t, p)][curr.pctChange.trippleBarriers[lbl]]++;

            i += getLookAhead(lbl); // should be more fair
          }
        }
      }
    }
  }

  logProbs(probs, timeframes, ps);
};