import { Candle, CoinList } from "./types";
// import { vol1 } from "./vol1";
import * as ms from "ms";
import { queryCoins } from "./queryCoins";
import * as pumps from "./pumps";
import { rescale } from "./rescale";
import { config } from "./config";
import { corr, LinRegResult, WARMUP_IND, EXTENDED } from "./corr";
import { PaperTrader } from "./gekko/PaperTrader";

const from = new Date("2018-08-01T00:00:00.000Z");
// const to = new Date("2018-08-13T00:00:00.000Z");
const to = new Date("2018-09-01T00:00:00.000Z");

// const { from, to } = pumps.jun2;

const fromExtended = new Date(from.getTime() - ms(`${WARMUP_IND}m`));
const toExtended = new Date(to.getTime() + ms(`${EXTENDED}m`));

interface Result {
  coins: CoinList;
  labelsPredicted: number[];
  linRegs: LinRegResult[];
}

export const run = (): Result => {
  const coins = queryCoins(fromExtended, toExtended);
  // vol1(coins);

  for (let key in coins) {
    coins[key].trader = new PaperTrader(coins[key].candles[60]);
  }

  const candlesActual = coins[config.leadCoin].candles.filter(
    x => x.start * 1000 >= from.getTime() && x.start * 1000 <= to.getTime()
  );

  // featurePower(coins[config.leadCoin].candles);
  const linRegs = corr(coins[config.leadCoin].candles);

  // const labelsPredicted = predictNeataptic(candlesActual);
  const labelsPredicted: number[] = [];

  return { coins, labelsPredicted, linRegs };
};
