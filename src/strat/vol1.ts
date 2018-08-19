import { CoinList, CoinData, AdviceObj } from "./types";
import { getCoinPctChange, getPctChange } from "./utils";
import { PaperTrader } from "./gekko/PaperTrader";
import { makeid } from "./makeid";
import { RSI } from "technicalindicators";

export const vol1 = (coins: CoinList) => {
  let rsi = new RSI({ period: 15, values: [] });

  for (let key in coins) {
    coins[key].trader = new PaperTrader(coins[key].candles[60]);
  }

  // const trader = new PaperTrader(coins.BTC.candles[60]);

  for (let i = 0; i < coins.BTC.candles.length; i++) {
    const rsiVal = rsi.nextValue(coins.BTC.candles[i].close);

    if (i < 60 || i >= coins.BTC.candles.length - 60) {
      continue; // history warmup
    }

    for (let key in coins) {
      coins[key].trader.processCandle(coins[key].candles[i]);
    }

    coins.BTC.candles[i].features = getFeatures(coins.BTC, i, rsiVal!);
    // coins.BTC.candles[i].label = getFutureResult(coins.BTC, i) > 5 ? 1 : -1;
    coins.BTC.candles[i].label = coins.BTC.candles[i].label =
      // getCoinPctChange(coins.BTC, i + 10, i) > 0 ? 1 : 0;
      // getCoinPctChange(coins.BTC, i + 30, i) > 0.5 ? 1 : 0;
      getCoinPctChange(coins.BTC, i + 30, i) > 1 ? 1 : 0;

    coins.BTC.candles[i].pctChange60m = getCoinPctChange(coins.BTC, i + 60, i);

    const change2m = getCoinPctChange(coins.BTC, i, i - 2);
    const change10m = getCoinPctChange(coins.BTC, i, i - 10);
    const change30m = getCoinPctChange(coins.BTC, i, i - 30);
    const change60m = getCoinPctChange(coins.BTC, i, i - 60);

    // console.log(change10m);
    if (change2m >= 1 || change10m >= 1 || change30m >= 2 || change60m >= 2) {
      // console.log(new Date(coins.BTC.candles[i].start * 1000), change10m);

      for (let key in coins) {
        coins[key].trader.processAdvice(
          {
            id: makeid(6),
            date: new Date(coins[key].candles[i].start * 1000),
            recommendation: "long"
          } as AdviceObj,
          coins[key].candles[i]
        );
      }
    } else if (
      change2m <= -1 ||
      change10m <= -1 ||
      change30m <= -2 ||
      change60m <= -2
    ) {
      for (let key in coins) {
        coins[key].trader.processAdvice(
          {
            id: makeid(6),
            date: new Date(coins[key].candles[i].start * 1000),
            recommendation: "short"
          } as AdviceObj,
          coins[key].candles[i]
        );
      }
    }
  }

  for (let key in coins) {
    coins[key].trader.performanceAnalyzer.finalize();
  }
};

export const getFutureResult = (coin: CoinData, i: number) => {
  const pricesAfter55to65 = coin.candles.slice(i + 55, i + 65);
  let sum = 0;
  for (let x of pricesAfter55to65) {
    sum += x.close;
  }

  const priceAfter60m = sum / pricesAfter55to65.length;
  const percentChangeAfter60m = getPctChange(
    priceAfter60m,
    coin.candles[i].close
  );
  return percentChangeAfter60m;
};

export const getFeatures = (coin: CoinData, i: number, rsiVal: number) => {
  return [
    getCoinPctChange(coin, i, i - 1),
    getCoinPctChange(coin, i, i - 2),
    getCoinPctChange(coin, i, i - 5),
    getCoinPctChange(coin, i, i - 10),
    getCoinPctChange(coin, i, i - 30),
    getCoinPctChange(coin, i, i - 60),
    rsiVal,
    coin.candles[i].volume
  ];
};
