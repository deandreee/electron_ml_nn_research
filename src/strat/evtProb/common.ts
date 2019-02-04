import { NumberMap } from "../ml/mlUtils";
import { padEnd, sumBy, minBy, maxBy } from "lodash";
import { CorrCandles } from "../corr/CorrCandles";
import { GetIndVal } from "../features/common";
import * as percentile from "stats-percentile";
import { round2 } from "../utils";
import { BarrierLabel, RunConfig } from "../run/runConfig";
import { getTrippleBarrierConfig } from "../corr/barrier";
import { Candle } from "../types";

export const TPB_LABELS: BarrierLabel[] = ["PT_FIVE", "ONE", "TWO", "THREE", "FIVE"];

export interface Probs {
  [ind: string]: NumberMap;
}

export const createProbsObj = (timeframes: string[], ps: string[]): Probs => {
  const probs: { [ind: string]: NumberMap } = {};

  for (let lbl of TPB_LABELS) {
    for (let t of timeframes) {
      for (let p of ps) {
        probs[formatTP(lbl, t, p)] = { 0: 0, 1: 0, 2: 0 };
      }
    }
  }
  return probs;
};

export const formatTP = (lbl: string, t: string, p: string) => {
  return `${padEnd(lbl, 7)} | ${t}.${p}`;
};

export const logTrippleBarrierStats = (corrCandles: CorrCandles) => {
  for (let lbl of TPB_LABELS) {
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

export const getMinMax = (getInd: GetIndVal, corrCandles: CorrCandles, t: string, p: string) => {
  const min = minBy(corrCandles.candlesActual, x => getInd(x, t, p));
  const max = maxBy(corrCandles.candlesActual, x => getInd(x, t, p));

  return { min: getInd(min, t, p), max: getInd(max, t, p) };
};

export const getMaxXth = (getInd: GetIndVal, corrCandles: CorrCandles, t: string, p: string, pct: number) => {
  const { max } = getMinMax(getInd, corrCandles, t, p);
  return max * (pct / 100);
};

export const getMaxPercentile = (getInd: GetIndVal, corrCandles: CorrCandles, t: string, p: string, pct: number) => {
  const valuesInOrder = corrCandles.candlesActual.map(x => getInd(x, t, p)).sort();
  const max80 = percentile(valuesInOrder, pct);
  return max80;
};

export const minMax = (
  indName: string,
  getInd: GetIndVal,
  corrCandles: CorrCandles,
  timeframes: string[],
  ps: string[]
) => {
  for (let t of timeframes) {
    for (let p of ps) {
      const min = minBy(corrCandles.candlesActual, x => getInd(x, t, p));
      const max = maxBy(corrCandles.candlesActual, x => getInd(x, t, p));

      console.log(
        `${indName}.${t}.${p}`,
        padEnd(round2(getInd(min, t, p)).toString(), 5),
        padEnd(round2(getInd(max, t, p)).toString(), 5)
      );
    }
  }
};

export const logProbs = (probs: Probs, timeframes: string[], ps: string[], threshold: number = 0.6) => {
  for (let lbl of TPB_LABELS) {
    for (let t of timeframes) {
      for (let p of ps) {
        const tp = formatTP(lbl, t, p);

        const sum = probs[tp][0] + probs[tp][1] + probs[tp][2];
        const p0 = round2(probs[tp][0] / sum);
        const p1 = round2(probs[tp][1] / sum);
        const p2 = round2(probs[tp][2] / sum);

        const ovr = `${probs[tp][0]}/${probs[tp][1]}/${probs[tp][2]}`;

        // const threshold = 0.5;
        // const threshold = 0.6;
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

export const getLookAhead = (runConfig: RunConfig, lbl: BarrierLabel) => {
  return getTrippleBarrierConfig(runConfig, lbl).lookAhead;
};

// retuns hit or miss
export type FnProb = (curr: Candle, prev: Candle, indCurr: any, indPrev: any) => boolean;

export type FnGetInd = (candle: Candle, t: string, p: string) => any;

// type LoopOpts = {
//   withMax: number;
// };

export const loop = async (
  runConfig: RunConfig,
  corrCandles: CorrCandles,
  timeframes: string[],
  ps: string[],
  getInd: FnGetInd,
  // opts: LoopOpts,
  fn: FnProb
) => {
  const probs = createProbsObj(timeframes, ps);

  logTrippleBarrierStats(corrCandles);

  for (let t of timeframes) {
    for (let p of ps) {
      for (let lbl of TPB_LABELS) {
        for (let i = 1; i < corrCandles.candlesActual.length; i++) {
          const curr = corrCandles.candlesActual[i];
          const prev = corrCandles.candlesActual[i - 1];

          const indCurr = getInd(curr, t, p);
          const indPrev = getInd(prev, t, p);

          //  buy
          if (fn(curr, prev, indCurr, indPrev)) {
            probs[formatTP(lbl, t, p)][curr.pctChange.trippleBarriers[lbl]]++;
            i += getLookAhead(runConfig, lbl); // should be more fair
          }
        }
      }
    }
  }

  logProbs(probs, timeframes, ps, 0);
};
