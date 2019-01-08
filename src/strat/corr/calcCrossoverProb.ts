import { CorrCandleMonths } from "../run/queryCorrCandlesMonths";
import { DateRange } from "../daterange";
import { NumberMap } from "../ml/mlUtils";
import { padEnd } from "lodash";
import { round2 } from "../utils";

const timeframes = ["x30", "x60", "x120", "x240", "x480"];
// const ps = ["emaOCC_5", "emaOCC_10", "emaOCC_20", "emaOCC_30", "emaOCC_40"];
const ps = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

const createProbsObj = () => {
  const probs: { [ind: string]: NumberMap } = {};
  for (let t of timeframes) {
    for (let p of ps) {
      probs[formatTP(t, p)] = { 0: 0, 1: 0, 2: 0 };
    }
  }
  return probs;
};

const formatTP = (t: string, p: string) => {
  return `${t}.${p}`;
};

export const cProb = (months: CorrCandleMonths, ranges: DateRange[]) => {
  const probs = createProbsObj();

  for (let range of ranges) {
    const corrCandles = months[range.name];

    console.log("candlesActual.length", corrCandles.candlesActual.length);

    for (let i = 1; i < corrCandles.candlesActual.length; i++) {
      const curr = corrCandles.candlesActual[i];
      // const prev = corrCandles.candlesActual[i - 1];

      for (let t of timeframes) {
        for (let p of ps) {
          // detect crossover
          //   if (curr.ind.emaOCC[t][p] > 0 && prev.ind.emaOCC[t][p] < 0) {
          // if (curr.ind.emaOCC[t][p] < 0 && prev.ind.emaOCC[t][p] > 0) {
          //   probs[formatTP(t, p)][curr.pctChange.trippleBarrier]++;
          //   // console.log(`emaOCC cross, trippleBarrier: ${curr.pctChange.trippleBarrier}`);
          // }

          if (curr.ind.vixFix[t][p] > 80) {
            probs[formatTP(t, p)][curr.pctChange.trippleBarrier]++;
            // console.log(`emaOCC cross, trippleBarrier: ${curr.pctChange.trippleBarrier}`);
          }
        }
      }
    }

    for (let t of timeframes) {
      for (let p of ps) {
        const tp = formatTP(t, p);

        const sum = probs[tp][0] + probs[tp][1] + probs[tp][2];
        const p0 = round2(probs[tp][0] / sum);
        const p1 = round2(probs[tp][1] / sum);
        const p2 = round2(probs[tp][2] / sum);

        const ovr = `${probs[tp][0]}/${probs[tp][1]}/${probs[tp][2]}`;

        if (p0 > 0.5 || p1 > 0.5 || p2 > 0.5) {
          console.log(
            padEnd(tp, 20),
            padEnd(p0.toString(), 5),
            padEnd(p1.toString(), 5),
            padEnd(p2.toString(), 5),
            padEnd(ovr, 5)
          );
        }
      }
    }
  }
};
