import { CoinList } from "./types";
// import { vol1 } from "./vol1";
import * as ms from "ms";
import { queryCoins } from "./queryCoins";
import { corrCalc, LinRegResult, WARMUP_IND, EXTENDED } from "./corrCalc";
import { PaperTrader } from "./gekko/PaperTrader";
// import { corrMFI } from "./corrMFI";
// import { corrATR } from "./corrATR";
// import { corrCCI } from "./corrCCI";
// import { corrMACD } from "./corrMACD";
import * as dataranges from "./dataranges";
// import { corrIFTS } from "./corrIFTS";
import * as predict from "./ml";

const range = dataranges.Jun;
const fromExtended = new Date(range.from.getTime() - ms(`${WARMUP_IND}m`));
const toExtended = new Date(range.to.getTime() + ms(`${EXTENDED}m`));

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

  // const cases = [coins.BTC, coins.ETH, coins.XRP, coins.BCC, coins.EOS, coins.XLM, coins.LTC, coins.ADA, coins.DASH];
  const cases = [coins.BTC];

  for (let coin of cases) {
    // console.log(
    //   ` ------------------------- ${coin.name} ------------------------- `
    // );
    const { candlesActual } = corrCalc(coin.candles);
    // corrMFI(candlesActual, pctChange);
    // corrATR(candlesActual, pctChange);
    // corrCCI(candlesActual, pctChange);
    // corrMACD(candlesActual, pctChange);
    // corrIFTS(coin.name, candlesActual, pctChange);
    predict.predictSvm(candlesActual);
  }

  // const labelsPredicted = predictNeataptic(candlesActual);
  const labelsPredicted: number[] = [];

  return { coins, labelsPredicted, linRegs: [] };
};
