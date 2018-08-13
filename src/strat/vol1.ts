import { Candle, CoinList, CoinData } from "./types";

const lookBack = 2;

export const vol1 = (coins: CoinList, buyAt?: Date) => {
  let hasBought = false;

  for (let i = 0; i < coins.BTC.candles.length; i++) {
    if (i < 60 || i > coins.BTC.candles.length - 60) {
      continue; // history warmup
    }

    coins.BTC.candles[i].features = getFeatures(coins.BTC, i);
    coins.BTC.candles[i].label = getFutureResult(coins.BTC, i) > 0.05 ? 1 : 0;

    // 09:53 first real sign of pump

    const change2m =
      (coins.BTC.candles[i].close / coins.BTC.candles[i - 2].close - 1) * 100;

    const change10m =
      (coins.BTC.candles[i].close / coins.BTC.candles[i - 10].close - 1) * 100;

    const change30m =
      (coins.BTC.candles[i].close / coins.BTC.candles[i - 30].close - 1) * 100;

    const change60m =
      (coins.BTC.candles[i].close / coins.BTC.candles[i - 60].close - 1) * 100;

    // console.log(change10m);
    if (
      !buyAt &&
      (change2m >= 1 || change10m >= 1 || change30m >= 2 || change60m >= 2)
    ) {
      // console.log(new Date(coins.BTC.candles[i].start * 1000), change10m);

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

  const resMax = (maxClose / coin.buyAt - 1) * 100;
  const resLast = (lastClose / coin.buyAt - 1) * 100;
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
  const percentChangeAfter60m =
    (priceAfter60m / coin.candles[i].close - 1) * 100;
  return percentChangeAfter60m;
};

export const getChangeXm = (coin: CoinData, i: number, m: number): number => {
  return (coin.candles[i].close / coin.candles[i - m].close - 1) * 100;
};

export const getVolumeXm = (coin: CoinData, i: number, m: number): number => {
  return (coin.candles[i].close / coin.candles[i - m].close - 1) * 100;
};

export const getFeatures = (coin: CoinData, i: number) => {
  const candle = coin.candles[i];
  return [
    getChangeXm(coin, i, 1),
    getChangeXm(coin, i, 2),
    getChangeXm(coin, i, 5),
    getChangeXm(coin, i, 10),
    getChangeXm(coin, i, 30),
    getChangeXm(coin, i, 60)
  ];
};
