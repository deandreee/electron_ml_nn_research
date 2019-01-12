import { CorrCandleMonths } from "../run/queryCorrCandlesMonths";
import { DateRange } from "../daterange";
import { NumberMap } from "../ml/mlUtils";
import { padEnd, minBy, maxBy, sumBy } from "lodash";
import { round2 } from "../utils";
import { CorrCandles } from "./CorrCandles";
// import * as gauss from "gauss";
import * as percentile from "stats-percentile";
// import { indName, getInd, timeframes, ps } from "../features/getVixFix";
import { indName, getInd, timeframes, ps } from "../features/getBBands";

const tbLabels = ["ptFive", "one", "two", "three", "five"];

const createProbsObj = () => {
  const probs: { [ind: string]: NumberMap } = {};

  for (let lbl of tbLabels) {
    for (let t of timeframes) {
      for (let p of ps) {
        probs[formatTP(lbl, t, p)] = { 0: 0, 1: 0, 2: 0 };
      }
    }
  }
  return probs;
};

const formatTP = (lbl: string, t: string, p: string) => {
  return `${padEnd(lbl, 7)} | ${t}.${p}`;
};

export const cProb = async (months: CorrCandleMonths, ranges: DateRange[]) => {
  const probs = createProbsObj();

  const corrCandles = months[ranges[0].name];

  console.log("candlesActual.length", corrCandles.candlesActual.length);
  logTrippleBarrierStats(corrCandles);
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

        // bbands
        const indCurr = getInd(curr, t, p);
        const indPrev = getInd(prev, t, p);

        for (let lbl of tbLabels) {
          // hit lower
          if (prev.close > indPrev.lower && curr.close < indCurr.lower) {
            probs[formatTP(lbl, t, p)][curr.pctChange.trippleBarriers[lbl]]++;
            //   // coole.log(`emaOCC cross, trippleBarrier: ${curr.pctChange.trippleBarrier}`);
          }

          // hit upper
          // if (prev.close < indPrev.upper && curr.close > indCurr.upper) {
          //   probs[formatTP(t, p)][curr.pctChange.trippleBarrier]++;
          //   //   // coole.log(`emaOCC cross, trippleBarrier: ${curr.pctChange.trippleBarrier}`);
          // }
        }
      }
    }
  }

  for (let lbl of tbLabels) {
    for (let t of timeframes) {
      for (let p of ps) {
        const tp = formatTP(lbl, t, p);

        const sum = probs[tp][0] + probs[tp][1] + probs[tp][2];
        const p0 = round2(probs[tp][0] / sum);
        const p1 = round2(probs[tp][1] / sum);
        const p2 = round2(probs[tp][2] / sum);

        const ovr = `${probs[tp][0]}/${probs[tp][1]}/${probs[tp][2]}`;

        // const threshold = 0.5;
        const threshold = 0.6;
        if (p0 > threshold || p1 > threshold || p2 > threshold) {
          console.log(
            padEnd(tp, 30),
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

export const logTrippleBarrierStats = (corrCandles: CorrCandles) => {
  for (let lbl of tbLabels) {
    const lbls = corrCandles.candlesActual.map(x => x.pctChange.trippleBarriers[lbl]);
    const zeroes = sumBy(lbls, x => (x === 0 ? 1 : 0));
    const ones = sumBy(lbls, x => (x === 1 ? 1 : 0));
    const twos = sumBy(lbls, x => (x === 2 ? 1 : 0));

    console.log(
      padEnd("LBL STATS", 10),
      padEnd(lbl, 7),
      padEnd(lbls.length.toString(), 10),
      padEnd(zeroes.toString(), 5),
      padEnd(ones.toString(), 5),
      padEnd(twos.toString(), 5)
    );
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
