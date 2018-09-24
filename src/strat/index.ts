import { CoinList } from "./types";
// import { vol1 } from "./vol1";
import * as ms from "ms";
import { queryCoins } from "./queryCoins";
import { corrCalc, LinRegResult, WARMUP_IND, EXTENDED } from "./corrCalc";
import { PaperTrader } from "./gekko/PaperTrader";
import { corrMFI } from "./corrMFI";

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

  // featurePower(coins[config.leadCoin].candles);
  // corr(coins.BTC.candles);

  const cases = [
    coins.BTC,
    coins.ETH,
    coins.XRP,
    coins.BCC,
    coins.EOS,
    coins.XLM,
    coins.LTC,
    coins.ADA,
    coins.DASH
  ];

  for (let coin of cases) {
    const { candlesActual, pctChange } = corrCalc(coin.candles);
    console.log(
      ` ------------------------- ${coin.name} ------------------------- `
    );
    corrMFI(candlesActual, pctChange);
  }

  // const labelsPredicted = predictNeataptic(candlesActual);
  const labelsPredicted: number[] = [];

  return { coins, labelsPredicted, linRegs: [] };
};
