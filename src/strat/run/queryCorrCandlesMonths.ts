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

export const queryCorrCandlesMonthsBatched = (
  coinName: Coins,
  ranges: DateRange[],
  featuresSplit: FeatureSplit[],
  opt?: object,
  prob?: boolean
) => {
  const corrCandleMonths: CorrCandleMonths = {};

  for (let range of ranges) {
    log.start(`query ${range.name}`);
    const fromExtended = new Date(range.from.getTime() - ms(`${calcBatched.WARMUP_IND}m`));
    const toExtended = new Date(range.to.getTime() + ms(`${calcBatched.EXTENDED}m`));
    const coin = queryCoin(coinName, fromExtended, toExtended);

    batchCandlesIn10s(coin);

    const { corrCandles } = !prob
      ? calcBatched.corrCalcBatched(coin, featuresSplit, opt)
      : calcBatchedProb.corrCalcBatchedProb(coin, featuresSplit);

    corrCandleMonths[range.name] = corrCandles;
    log.end(`query ${range.name}`);
  }
  return corrCandleMonths;
};
