import { Candle, CoinList, CoinData, AdviceObj } from "./types";
import { getCoinPctChange, getPctChange } from "./utils";
import { PaperTrader } from "./gekko/PaperTrader";
import { makeid } from "./makeid";

const lookBack = 2;

export const vol1 = (coins: CoinList, buyAt?: Date) => {
  let hasBought = false;

  const trader = new PaperTrader(coins.BTC.candles[60]);

  for (let i = 0; i < coins.BTC.candles.length; i++) {
    if (i < 60 || i >= coins.BTC.candles.length - 60) {
      continue; // history warmup
    }

    trader.processCandle(coins.BTC.candles[i]);

    coins.BTC.candles[i].features = getFeatures(coins.BTC, i);
    coins.BTC.candles[i].label = getFutureResult(coins.BTC, i) > 5 ? 1 : -1;
    coins.BTC.candles[i].pctChange60m = getCoinPctChange(coins.BTC, i + 60, i);

    // 09:53 first real sign of pump

    const change2m = getCoinPctChange(coins.BTC, i, i - 2);
    const change10m = getCoinPctChange(coins.BTC, i, i - 10);
    const change30m = getCoinPctChange(coins.BTC, i, i - 30);
    const change60m = getCoinPctChange(coins.BTC, i, i - 60);

    // console.log(change10m);
    if (
      !buyAt &&
      (change2m >= 1 || change10m >= 1 || change30m >= 2 || change60m >= 2)
    ) {
      // console.log(new Date(coins.BTC.candles[i].start * 1000), change10m);

      trader.processAdvice(
        {
          id: makeid(6),
          date: new Date(),
          recommendation: "long"
        } as AdviceObj,
        coins.BTC.candles[i]
      );

      if (!hasBought) {
        for (let key in coins) {
          coins[key].buyAt = coins[key].candles[i].close;
          coins[key].buyAtTs = coins[key].candles[i].start;
          coins[key].buyAtIdx = i;
          coins[key].buyAtProfit = coins[key].candles[i].percentChange;
        }
        // Object.keys(coins).forEach(x => coins[x].buyAt = coins[x].candles[i].close);
        hasBought = true;
      }
    } else if (
      !buyAt &&
      (change2m <= -1 || change10m <= -1 || change30m <= -2 || change60m <= -2)
    ) {
      if (!hasBought) {
        for (let key in coins) {
          coins[key].buyAt = coins[key].candles[i].close;
          coins[key].buyAtTs = coins[key].candles[i].start;
          coins[key].buyAtIdx = i;
          coins[key].buyAtProfit = coins[key].candles[i].percentChange;
        }
        // Object.keys(coins).forEach(x => coins[x].buyAt = coins[x].candles[i].close);
        hasBought = true;
      }
    }

    let date = new Date(coins.BTC.candles[i].start * 1000).toUTCString();
    if (buyAt && buyAt.toUTCString() === date) {
      for (let key in coins) {
        coins[key].buyAt = coins[key].candles[i].close;
        coins[key].buyAtTs = coins[key].candles[i].start;
        coins[key].buyAtIdx = i;
        coins[key].buyAtProfit = coins[key].candles[i].percentChange;
      }
    }
  }

  // console.log("max rise from buy btc", Math.max(...candlesBtc.map(x => x.close)) / btcBuyAt);

  for (let key in coins) {
    calcProfit(coins[key]);
  }
};

export const calcProfit = (coin: CoinData) => {
  const maxClose = Math.max(...coin.candles.map(x => x.close));
  const lastClose = coin.candles[coin.candles.length - 1].close;

  const resMax = getPctChange(maxClose, coin.buyAt);
  const resLast = getPctChange(lastClose, coin.buyAt);
  //   console.log(
  //     `${coin.name} \t profit last \t`,
  //     Math.round(resLast * 100) / 100,
  //     "%",
  //     `\t max \t`,
  //     Math.round(resMax * 100) / 100
  //   );

  coin.profitLast = Math.round(resLast * 100) / 100;
  coin.profitMax = Math.round(resMax * 100) / 100;
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

export const getFeatures = (coin: CoinData, i: number) => {
  const candle = coin.candles[i];
  return [
    getCoinPctChange(coin, i, i - 1),
    getCoinPctChange(coin, i, i - 2),
    getCoinPctChange(coin, i, i - 5),
    getCoinPctChange(coin, i, i - 10),
    getCoinPctChange(coin, i, i - 30),
    getCoinPctChange(coin, i, i - 60)
  ];
};
