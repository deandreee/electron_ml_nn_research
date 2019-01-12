import { CorrCandleMonths } from "../run/queryCorrCandlesMonths";
import { DateRange } from "../daterange";
import { NumberMap } from "../ml/mlUtils";
import { padEnd, minBy, maxBy } from "lodash";
import { round2 } from "../utils";
import { CorrCandles } from "./CorrCandles";
// import * as gauss from "gauss";
import * as percentile from "stats-percentile";
// import { indName, getInd, timeframes, ps } from "../features/getVixFix";
import { indName, getInd, timeframes, ps } from "../features/getBBands";

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

export const cProb = async (months: CorrCandleMonths, ranges: DateRange[]) => {
  const probs = createProbsObj();

  const corrCandles = months[ranges[0].name];

  console.log("candlesActual.length", corrCandles.candlesActual.length);
  // minMax(corrCandles);

  for (let t of timeframes) {
    for (let p of ps) {
      // asc

      // const max80 = getMaxXth(corrCandles, t, p, 80);
      // const max80pct = 0; // getMaxPercentile(corrCandles, t, p, 99.9);

      // console.log("max80", padEnd(t, 5), padEnd(p, 5), round2(max80), round2(max80pct));

      // const { max } = getMinMax(corrCandles, t, p);
      // const max80 = await fromCb(cb => vector.percentile(2, cb));
      // const max80 = await fromCbGauss(cb => vector.percentile(0.8, cb));
      // console.log(await fromCbGauss(cb => vector.distribution("absolute", cb)));
      // console.log(await fromCb(cb => vector.distribution(cb)));

      for (let i = 1; i < corrCandles.candlesActual.length; i++) {
        const curr = corrCandles.candlesActual[i];
        const prev = corrCandles.candlesActual[i - 1];

        // detect crossover
        //   if (curr.ind.emaOCC[t][p] > 0 && prev.ind.emaOCC[t][p] < 0) {
        // if (curr.ind.emaOCC[t][p] < 0 && prev.ind.emaOCC[t][p] > 0) {
        //   probs[formatTP(t, p)][curr.pctChange.trippleBarrier]++;
        //   // console.log(`emaOCC cross, trippleBarrier: ${curr.pctChange.trippleBarrier}`);
        // }
        // const min = minBy(

        // vixFix ...
        const indCurr = getInd(curr, t, p);
        const indPrev = getInd(prev, t, p);
        if (indPrev.lower > curr.close && indCurr.lower < curr.close) {
          probs[formatTP(t, p)][curr.pctChange.trippleBarrier]++;
          //   // coole.log(`emaOCC cross, trippleBarrier: ${curr.pctChange.trippleBarrier}`);
        }

        // bbands
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

export const getMinMax = (corrCandles: CorrCandles, t: string, p: string) => {
  const min = minBy(corrCandles.candlesActual, x => getInd(x, t, p));
  const max = maxBy(corrCandles.candlesActual, x => getInd(x, t, p));

  return { min: getInd(min, t, p).lower, max: getInd(max, t, p).lower };
};

export const getMaxXth = (corrCandles: CorrCandles, t: string, p: string, pct: number) => {
  const { max } = getMinMax(corrCandles, t, p);
  return max * (pct / 100);
};

export const getMaxPercentile = (corrCandles: CorrCandles, t: string, p: string, pct: number) => {
  const valuesInOrder = corrCandles.candlesActual.map(x => getInd(x, t, p)).sort();
  const max80 = percentile(valuesInOrder, pct);
  return max80;
};

export const minMax = (corrCandles: CorrCandles) => {
  for (let t of timeframes) {
    for (let p of ps) {
      const min = minBy(corrCandles.candlesActual, x => getInd(x, t, p));
      const max = maxBy(corrCandles.candlesActual, x => getInd(x, t, p));

      console.log(
        `${indName}.${t}.${p}`,
        padEnd(round2(getInd(min, t, p).lower).toString(), 5),
        padEnd(round2(getInd(max, t, p).lower).toString(), 5)
      );
    }
  }
};
