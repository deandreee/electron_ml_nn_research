import { Candle, CoinList, CoinData } from "./types";

const lookBack = 2;

export const vol1 = (coins: CoinList, buyAt?: Date) => {
  let hasBought = false;

  for (let i = 0; i < coins.BTC.candles.length; i++) {
    if (i < lookBack) {
      continue; // history warmup
    }

    // 09:53 first real sign of pump

    const change10m =
      (coins.BTC.candles[i].close / coins.BTC.candles[i - lookBack].close - 1) *
      100;
    // console.log(change10m);
    if (!buyAt && change10m >= 1) {
      console.log(new Date(coins.BTC.candles[i].start * 1000), change10m);

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
