import { Coins, CoinData } from "../strat/types";
import * as daterange from "../strat/daterange";
import { queryCoin } from "../strat/queryCoins";
import { getPctChange } from "../strat/utils";
// @ts-ignore
import { padEnd, padStart } from "lodash";

const range = daterange.Dec;

const getMin = (coin: CoinData) => {
  let min = Infinity;
  for (let x of coin.candles) {
    if (x.close < min) {
      min = x.close;
    }
  }
  return min;
};

const getMax = (coin: CoinData) => {
  let max = -Infinity;
  for (let x of coin.candles) {
    if (x.close > max) {
      max = x.close;
    }
  }
  return max;
};

// 19 is ok I'm skipping VEN also in backtests
export const marketMonth = () => {
  const coins = [
    Coins.BTC,
    Coins.ETH,
    Coins.XRP,
    // Coins.BCC,
    Coins.EOS,
    Coins.XLM,
    Coins.LTC,
    Coins.ADA,
    Coins.IOT,
    Coins.TRX,
    Coins.XMR,
    Coins.NEO,
    Coins.DASH,
    Coins.ETC,
    Coins.BNB,
    // Coins.VEN,
    Coins.ZEC,
    Coins.QTUM,
    Coins.OMG,
    Coins.ZRX
  ];

  for (let x of coins) {
    getResultForCoin(x);
  }
};

const getResultForCoin = (coinName: Coins) => {
  const coin = queryCoin(coinName, range.from, range.to);

  if (coin.candles.length === 0) {
    // console.log("no candles for " + coinName);
    console.log(0);
    return;
  }

  // logFull(coin);
  logSmall(coin);
};

export const logSmall = (coin: CoinData) => {
  const start = coin.candles[0].open;
  const end = coin.candles[coin.candles.length - 1].close;
  const pctChange = Math.round(getPctChange(end, start));
  console.log(pctChange);
};

export const logFull = (coin: CoinData) => {
  const start = coin.candles[0].open;
  const end = coin.candles[coin.candles.length - 1].close;
  //   const third = Math.floor(coin.candles.length / 3);
  //   const thirdX1 = coin.candles[third].close;
  //   const thirdX2 = coin.candles[third * 2].close;
  const min = getMin(coin);
  const max = getMax(coin);

  const pctChange = Math.round(getPctChange(end, start));
  //   const pctChangeThirdX1 = Math.round(getPctChange(thirdX1, start));
  //   const pctChangeThirdX2 = Math.round(getPctChange(thirdX2, start));
  const pctChangeMin = Math.round(getPctChange(min, start));
  const pctChangeMax = Math.round(getPctChange(max, start));
  console.log(
    // padEnd(coinName, 5),
    padStart(pctChangeMin.toString(), 5),
    padStart(pctChangeMax.toString(), 5),
    padStart(pctChange.toString(), 5)
  );
};
