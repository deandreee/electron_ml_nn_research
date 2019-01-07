import { CorrCandleMonths } from "../run/queryCorrCandlesMonths";
import { DateRange } from "../daterange";

export const cProb = (months: CorrCandleMonths, ranges: DateRange[]) => {
  for (let range of ranges) {
    const corrCandles = months[range.name];

    for (let i = 0; i < corrCandles.candlesActual.length; i++) {
      const curr = corrCandles.candlesActual[i];
      const prev = corrCandles.getPrev(i, 1);

      // detect crossover
      if (curr.ind.emaOCC.x30 > 0 && prev.ind.emaOCC.x30 < 0) {
        console.log(`emaOCC cross, trippleBarrier: ${curr.pctChange.trippleBarrier}`);
      }
    }
  }
};
