import { Candle, CoinList } from "./types";
import { vol1 } from "./vol1";
import * as ms from "ms";
import { queryCoins } from "./queryCoins";
import * as pumps from "./pumps";
import { rescale } from "./rescale";
import { config } from "./config";
import { featurePower } from "./featurePower";
import { corr } from "./corr";
import { PaperTrader } from "./gekko/PaperTrader";

const from = new Date("2018-08-10T00:00:00.000Z");
// const to = new Date("2018-08-13T00:00:00.000Z");
const to = new Date("2018-08-22T00:00:00.000Z");

// const { from, to } = pumps.jun2;

const fromExtended = new Date(from.getTime() - ms(`${15 * 30}m`)); // because XmRsi
const toExtended = new Date(to.getTime() + ms("1h"));

interface Result {
  coins: CoinList;
  labelsPredicted: number[];
  x: number[];
  y: number[];
  regEquation: number[];
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
  const { x, y, regEquation } = corr(coins[config.leadCoin].candles);

  // const labelsPredicted = predictNeataptic(candlesActual);
  const labelsPredicted: number[] = [];

  return { coins, labelsPredicted, x, y, regEquation };
};
