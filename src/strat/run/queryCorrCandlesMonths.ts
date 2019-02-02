import { Coins, CoinData } from "../types";
import * as ms from "ms";
import { queryCoin } from "../queryCoins";
import * as calcBatched from "../corr/calcBatched";
import { CorrCandles } from "../corr/CorrCandles";
import { DateRange } from "../daterange";
import * as log from "../log";
import { batchCandlesInXs } from "../db/batchCandlesInXs";
import * as calcBatchedProb from "../corr/calcBatchedProb";
import { FeatureSplit } from "../features";

export type CorrCandleMonths = { [range: string]: CorrCandles };
export type CandleMonths = { [range: string]: CoinData };

export const queryCorrCandlesMonths = (coinName: Coins, ranges: DateRange[]) => {
  const corrCandleMonths: CorrCandleMonths = {};

  for (let range of ranges) {
    log.start(`query ${range.name}`);

    const calc = { WARMUP_IND: 0, EXTENDED: 0 };

    const fromExtended = new Date(range.from.getTime() - ms(`${calc.WARMUP_IND}m`));
    const toExtended = new Date(range.to.getTime() + ms(`${calc.EXTENDED}m`));
    const coin = queryCoin(coinName, fromExtended, toExtended);

    // need to implement when/if get back to this
    // const { corrCandles } = calc.corrCalc(coin);
    const corrCandles = new CorrCandles(coin, [], [], 0, 0);

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

    coin.candles = batchCandlesInXs(coin.candles, calcBatched.BATCH_SIZE);

    if (!opts.skipLog) {
      log.end(`query ${range.name}`);
    }

    if (!opts.skipLog) {
      log.start(`corrCandles ${range.name}`);
    }

    const { corrCandles } = !opts.prob
      ? calcBatched.corrCalcBatched(coin, featuresSplit, opts.ga)
      : calcBatchedProb.corrCalcBatchedProb(coin, featuresSplit);

    corrCandleMonths[range.name] = corrCandles;
    if (!opts.skipLog) {
      log.end(`corrCandles ${range.name}`);
    }
  }
  return corrCandleMonths;
};

export const queryCandlesBatched = (coinName: Coins, ranges: DateRange[]) => {
  const candleMonths: CandleMonths = {};

  for (let range of ranges) {
    const fromExtended = new Date(range.from.getTime() - ms(`${calcBatched.WARMUP_IND}m`));
    const toExtended = new Date(range.to.getTime() + ms(`${calcBatched.EXTENDED}m`));
    const coin = queryCoin(coinName, fromExtended, toExtended);

    coin.candles = batchCandlesInXs(coin.candles, calcBatched.BATCH_SIZE);

    candleMonths[range.name] = coin;
  }

  return candleMonths;
};

export const calcIndicators = (
  candleMonths: CandleMonths,
  ranges: DateRange[],
  featuresSplit: FeatureSplit[],
  opts?: Opts
) => {
  opts = opts || {};

  const corrCandleMonths: CorrCandleMonths = {};

  for (let range of ranges) {
    const coin = candleMonths[range.name];

    const { corrCandles } = !opts.prob
      ? calcBatched.corrCalcBatched(coin, featuresSplit, opts.ga)
      : calcBatchedProb.corrCalcBatchedProb(coin, featuresSplit);

    corrCandleMonths[range.name] = corrCandles;
  }

  return corrCandleMonths;
};
