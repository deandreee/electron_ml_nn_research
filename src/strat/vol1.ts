import { CoinList, CoinData, AdviceObj } from "./types";
import { getCoinPctChange, getPctChange } from "./utils";
import { PaperTrader } from "./gekko/PaperTrader";
import { makeid } from "./makeid";
import { RSI, PSAR } from "technicalindicators";
import { stratPump, stratPsar } from "./strats";
import { XmPsar } from "./strats/ind/XmPsar";
import { XmRsi } from "./strats/ind/XmRsi";

export const vol1 = (coins: CoinList) => {
  let rsi = new RSI({ period: 15, values: [] });
  let xmPsar = new XmPsar(10);
  let xmRsi = new XmRsi(30, 15);
  let warmup = 30 * 15; // min

  for (let key in coins) {
    coins[key].trader = new PaperTrader(coins[key].candles[60]);
  }

  // const trader = new PaperTrader(coins.BTC.candles[60]);

  for (let i = 0; i < coins.BTC.candles.length; i++) {
    // const rsiVal = rsi.nextValue(coins.BTC.candles[i].close);
    const psarVal = xmPsar.update(coins.EOS.candles[i]);
    const rsiVal = xmRsi.update(coins.EOS.candles[i]);

    coins.BTC.candles[i].ind = {
      rsi: rsiVal,
      psar: psarVal
    };

    coins.EOS.candles[i].ind = {
      rsi: rsiVal,
      psar: psarVal
    };

    // console.log("close: ", coins.BTC.candles[i].close);
    // console.log("high: ", coins.BTC.candles[i].high);
    // console.log("low: ", coins.BTC.candles[i].low);
    // console.log("rsi: ", rsiVal);
    // console.log("psarVal: ", psarVal);

    if (i < warmup || i >= coins.BTC.candles.length - 60) {
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

    coins.BTC.candles[i].pctChange60m = getCoinPctChange(coins.BTC, i + 30, i);

    // stratPump.check(coins, i);
    stratPsar.check(coins, i);

    // console.log(change10m);
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
