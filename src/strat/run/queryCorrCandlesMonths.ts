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
import { BatchConfig } from "../corr/BatchConfig";
import { RunConfig } from "./runConfig";

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
    const corrCandles = new CorrCandles(coin, [], [], new BatchConfig(0, 0));

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
  runConfig: RunConfig,
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
    const fromExtended = new Date(range.from.getTime() - ms(`${runConfig.BATCH.warmupInd}m`));
    const toExtended = new Date(range.to.getTime() + ms(`${runConfig.BATCH.extended}m`));
    const coin = queryCoin(coinName, fromExtended, toExtended);

    coin.candles = batchCandlesInXs(coin.candles, runConfig.BATCH.batchSize);

    if (!opts.skipLog) {
      log.end(`query ${range.name}`);
    }

    if (!opts.skipLog) {
      log.start(`corrCandles ${range.name}`);
    }

    const { corrCandles } = !opts.prob
      ? calcBatched.corrCalcBatched(runConfig, coin, featuresSplit, opts.ga)
      : calcBatchedProb.corrCalcBatchedProb(runConfig, coin, featuresSplit);

    corrCandleMonths[range.name] = corrCandles;
    if (!opts.skipLog) {
      log.end(`corrCandles ${range.name}`);
    }
  }
  return corrCandleMonths;
};

export const queryCandles = (runConfig: RunConfig, coinName: Coins, ranges: DateRange[]) => {
  const candleMonths: CandleMonths = {};

  for (let range of ranges) {
    const fromExtended = new Date(range.from.getTime() - ms(`${runConfig.BATCH.warmupInd}m`));
    const toExtended = new Date(range.to.getTime() + ms(`${runConfig.BATCH.extended}m`));
    const coin = queryCoin(coinName, fromExtended, toExtended);

    candleMonths[range.name] = coin;
  }

  return candleMonths;
};

export const queryCandlesBatched = (runConfig: RunConfig, coinName: Coins, ranges: DateRange[]) => {
  const candleMonths = queryCandles(runConfig, coinName, ranges);

  for (let range of ranges) {
    const coin = candleMonths[range.name];
    coin.candles = batchCandlesInXs(coin.candles, runConfig.BATCH.batchSize);
    candleMonths[range.name] = coin;
  }

  return candleMonths;
};

export const calcIndicators = (
  runConfig: RunConfig,
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
      ? calcBatched.corrCalcBatched(runConfig, coin, featuresSplit, opts.ga)
      : calcBatchedProb.corrCalcBatchedProb(runConfig, coin, featuresSplit);

    corrCandleMonths[range.name] = corrCandles;
  }

  return corrCandleMonths;
};
