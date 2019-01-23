import { Coins } from "../types";
import * as ms from "ms";
import { queryCoin } from "../queryCoins";
import * as calc from "../corr/calc";
import * as calcBatched from "../corr/calcBatched";
import { CorrCandles } from "../corr/CorrCandles";
import { DateRange } from "../daterange";
import * as log from "../log";
import { batchCandlesIn10s } from "../db/batchCandlesIn10s";
import * as calcBatchedProb from "../corr/calcBatchedProb";
import { FeatureSplit } from "../features";

export type CorrCandleMonths = { [range: string]: CorrCandles };

export const queryCorrCandlesMonths = (coinName: Coins, ranges: DateRange[]) => {
  const corrCandleMonths: CorrCandleMonths = {};

  for (let range of ranges) {
    log.start(`query ${range.name}`);
    const fromExtended = new Date(range.from.getTime() - ms(`${calc.WARMUP_IND}m`));
    const toExtended = new Date(range.to.getTime() + ms(`${calc.EXTENDED}m`));
    const coin = queryCoin(coinName, fromExtended, toExtended);
    const { corrCandles } = calc.corrCalc(coin);
    corrCandleMonths[range.name] = corrCandles;
    log.end(`query ${range.name}`);
  }
  return corrCandleMonths;
};

interface Opts {
  ga?: object;
  prob?: boolean;
  skipLog?: boolean;
}

export const queryCorrCandlesMonthsBatched = (
  coinName: Coins,
  ranges: DateRange[],
  featuresSplit: FeatureSplit[],
  opts?: Opts
) => {
  opts = opts || {};

  const corrCandleMonths: CorrCandleMonths = {};

  for (let range of ranges) {
    if (!opts.skipLog) {
      log.start(`query ${range.name}`);
    }
    const fromExtended = new Date(range.from.getTime() - ms(`${calcBatched.WARMUP_IND}m`));
    const toExtended = new Date(range.to.getTime() + ms(`${calcBatched.EXTENDED}m`));
    const coin = queryCoin(coinName, fromExtended, toExtended);

    batchCandlesIn10s(coin);

    const { corrCandles } = !opts.prob
      ? calcBatched.corrCalcBatched(coin, featuresSplit, opts.ga)
      : calcBatchedProb.corrCalcBatchedProb(coin, featuresSplit);

    corrCandleMonths[range.name] = corrCandles;
    if (!opts.skipLog) {
      log.end(`query ${range.name}`);
    }
  }
  return corrCandleMonths;
};
