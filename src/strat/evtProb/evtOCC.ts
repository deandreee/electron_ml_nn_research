import { CorrCandleMonths } from "../run/queryCorrCandlesMonths";
import { DateRange } from "../daterange";
import { getInd, timeframes, ps } from "../features/getOCC";
import { logTrippleBarrierStats, createProbsObj, formatTP, logProbs } from "./common";
import { getTrippleBarrierConfig } from "../corr/trippleBarrier";
// import { getTrippleBarrierConfig } from "../corr/trippleBarrier";
// import { TrippleBarrierLabel } from "../run/runConfigXG";

const tbLabels = ["ptFive", "one", "two", "three", "five"];

export const probsOCC = async (months: CorrCandleMonths, ranges: DateRange[]) => {
  const probs = createProbsObj(timeframes, ps);

  const corrCandles = months[ranges[0].name];
  logTrippleBarrierStats(corrCandles);

  for (let t of timeframes) {
    for (let p of ps) {
      for (let lbl of tbLabels) {
        for (let i = 1; i < corrCandles.candlesActual.length; i++) {
          const curr = corrCandles.candlesActual[i];
          // const prev = corrCandles.candlesActual[i - 1];

          const indCurr = getInd(curr, t, p);
          // const indPrev = getInd(prev, t, p);

          // detect crossover
          if (indCurr > 0) {
            probs[formatTP(lbl, t, p)][curr.pctChange.trippleBarriers[lbl]]++;

            const lblCfg = getTrippleBarrierConfig("THREE");
            i += lblCfg.lookAhead; // should be more fair
          }
        }
      }
    }
  }

  logProbs(probs, timeframes, ps, 0);
};
