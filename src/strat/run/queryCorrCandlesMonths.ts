import { Coins } from "../types";
import * as ms from "ms";
import { queryCoin } from "../queryCoins";
import { corrCalc, WARMUP_IND, EXTENDED, CorrCandles } from "../corrCalc";
import { DateRange } from "../daterange";
import * as log from "../log";
import { batchCandlesIn10s } from "../db/batchCandlesIn10s";

export const queryCorrCandlesMonths = (coinName: Coins, ranges: DateRange[]) => {
  const corrCandleMonths: { [range: string]: CorrCandles } = {};

  for (let range of ranges) {
    log.start(`query ${range.name}`);
    const fromExtended = new Date(range.from.getTime() - ms(`${WARMUP_IND}m`));
    const toExtended = new Date(range.to.getTime() + ms(`${EXTENDED}m`));
    const coin = queryCoin(coinName, fromExtended, toExtended);
    const { corrCandles } = corrCalc(coin);
    corrCandleMonths[range.name] = corrCandles;
    log.end(`query ${range.name}`);
  }
  return corrCandleMonths;
};

export const queryCorrCandlesMonthsBatched = (coinName: Coins, ranges: DateRange[]) => {
  const corrCandleMonths: { [range: string]: CorrCandles } = {};

  for (let range of ranges) {
    log.start(`query ${range.name}`);
    const fromExtended = new Date(range.from.getTime() - ms(`${WARMUP_IND}m`));
    const toExtended = new Date(range.to.getTime() + ms(`${EXTENDED}m`));
    const coin = queryCoin(coinName, fromExtended, toExtended);

    batchCandlesIn10s(coin);

    const { corrCandles } = corrCalc(coin);
    corrCandleMonths[range.name] = corrCandles;
    log.end(`query ${range.name}`);
  }
  return corrCandleMonths;
};
