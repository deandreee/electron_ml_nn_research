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
import * as csvLogger from "./csvLogger";
import { getFeaturesSplit } from "./getFeatures";

interface Result {
  coins: CoinList;
  labelsPredicted: number[];
  linRegs: LinRegResult[];
}

export const run = async (): Promise<Result> => {
  const range = dataranges.Jun;
  const fromExtended = new Date(range.from.getTime() - ms(`${WARMUP_IND}m`));
  const toExtended = new Date(range.to.getTime() + ms(`${EXTENDED}m`));

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
    const { corrCandles } = corrCalc(coin.candles);
    // corrMFI(candlesActual, pctChange);
    // corrATR(candlesActual, pctChange);
    // corrCCI(candlesActual, pctChange);
    // corrMACD(candlesActual, pctChange);
    // corrIFTS(coin.name, candlesActual, pctChange);

    const featuresSplit = getFeaturesSplit();
    for (let x of featuresSplit) {
      const { results, results3s, results5s } = await predict.predictSvm(corrCandles, x.fn);
      await csvLogger.append("svms", range.name, x.name, { results, results3s, results5s });
    }

    // predictNext(svm, dataranges.Jul);
    // predictNext(svm, dataranges.Aug);
    // predictNext(svm, dataranges.Sep);
  }

  // const labelsPredicted = predictNeataptic(candlesActual);
  const labelsPredicted: number[] = [];

  return { coins, labelsPredicted, linRegs: [] };
};

export const predictNext = (svm: any, datarange: any) => {
  const fromExtended = new Date(datarange.from.getTime() - ms(`${WARMUP_IND}m`));
  const toExtended = new Date(datarange.to.getTime() + ms(`${EXTENDED}m`));
  const coinsNext = queryCoins(fromExtended, toExtended);
  const { corrCandles } = corrCalc(coinsNext.BTC.candles);
  predict.predictAnotherMonth(svm, corrCandles);
};
