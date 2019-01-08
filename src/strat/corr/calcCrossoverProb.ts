import { CorrCandleMonths } from "../run/queryCorrCandlesMonths";
import { DateRange } from "../daterange";
import { NumberMap } from "../ml/mlUtils";
import { padEnd, minBy, maxBy } from "lodash";
import { round2 } from "../utils";
import { CorrCandles } from "./CorrCandles";

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

  const corrCandles = months[ranges[0].name];

  console.log("candlesActual.length", corrCandles.candlesActual.length);
  // minMax(corrCandles);

  for (let t of timeframes) {
    for (let p of ps) {
      const { max } = getMinMax(corrCandles, t, p);
      const max80 = max * 0.9; // 80 percent

      for (let i = 1; i < corrCandles.candlesActual.length; i++) {
        const curr = corrCandles.candlesActual[i];
        // const prev = corrCandles.candlesActual[i - 1];

        // detect crossover
        //   if (curr.ind.emaOCC[t][p] > 0 && prev.ind.emaOCC[t][p] < 0) {
        // if (curr.ind.emaOCC[t][p] < 0 && prev.ind.emaOCC[t][p] > 0) {
        //   probs[formatTP(t, p)][curr.pctChange.trippleBarrier]++;
        //   // console.log(`emaOCC cross, trippleBarrier: ${curr.pctChange.trippleBarrier}`);
        // }
        // const min = minBy(
        if (curr.ind.vixFix[t][p] > max80) {
          probs[formatTP(t, p)][curr.pctChange.trippleBarrier]++;
          //   // coole.log(`emaOCC cross, trippleBarrier: ${curr.pctChange.trippleBarrier}`);
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

      if (p0 > 0.6 || p1 > 0.6 || p2 > 0.6) {
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
};

const getMinMax = (corrCandles: CorrCandles, t: string, p: string) => {
  const min = minBy(corrCandles.candlesActual, x => x.ind.vixFix[t][p]);
  const max = maxBy(corrCandles.candlesActual, x => x.ind.vixFix[t][p]);

  return { min: min.ind.vixFix[t][p], max: max.ind.vixFix[t][p] };
};

export const minMax = (corrCandles: CorrCandles) => {
  for (let t of timeframes) {
    for (let p of ps) {
      const min = minBy(corrCandles.candlesActual, x => x.ind.vixFix[t][p]);
      const max = maxBy(corrCandles.candlesActual, x => x.ind.vixFix[t][p]);

      console.log(
        `vixFix.${t}.${p}`,
        padEnd(round2(min.ind.vixFix[t][p]).toString(), 5),
        padEnd(round2(max.ind.vixFix[t][p]).toString(), 5)
      );
    }
  }
};
