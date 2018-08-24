import { CoinList, CoinData, AdviceObj } from "./types";
import { getCoinPctChange, getPctChange } from "./utils";
import { PaperTrader } from "./gekko/PaperTrader";
import { makeid } from "./makeid";
import { RSI, PSAR } from "technicalindicators";
import { stratPump, stratPsar, stratHl } from "./strats";
import { XmPsar } from "./strats/ind/XmPsar";
import { XmRsi } from "./strats/ind/XmRsi";
import { config } from "./config";

export const vol1 = (coins: CoinList) => {
  let rsi = new RSI({ period: 15, values: [] });
  let xmPsar = new XmPsar(20);
  let xmRsi = new XmRsi(30, 15);
  let warmup = 30 * 15; // min
  const leadCoin = coins[config.leadCoin];

  for (let key in coins) {
    coins[key].trader = new PaperTrader(coins[key].candles[60]);
  }

  for (let i = 0; i < leadCoin.candles.length; i++) {
    const psarVal = xmPsar.update(leadCoin.candles[i]);
    const rsiVal = xmRsi.update(leadCoin.candles[i]);

    leadCoin.candles[i].ind = {
      rsi: rsiVal,
      psar: psarVal
    };

    // console.log("close: ", leadCoin.candles[i].close);
    // console.log("high: ", leadCoin.candles[i].high);
    // console.log("low: ", leadCoin.candles[i].low);
    // console.log("rsi: ", rsiVal);
    // console.log("psarVal: ", psarVal);

    if (i < warmup || i >= leadCoin.candles.length - 60) {
      continue; // history warmup
    }

    for (let key in coins) {
      coins[key].trader.processCandle(coins[key].candles[i]);
    }

    leadCoin.candles[i].features = getFeatures(leadCoin, i, rsiVal!);
    // leadCoin.candles[i].label = getFutureResult(leadCoin, i) > 5 ? 1 : -1;
    leadCoin.candles[i].label = leadCoin.candles[i].label =
      // getCoinPctChange(leadCoin, i + 10, i) > 0 ? 1 : 0;
      // getCoinPctChange(leadCoin, i + 30, i) > 0.5 ? 1 : 0;
      getCoinPctChange(leadCoin, i + 30, i) > 1 ? 1 : 0;

    leadCoin.candles[i].pctChange60m = getCoinPctChange(leadCoin, i + 30, i);

    // stratPump.check(coins, i);
    // stratPsar.check(coins, i);
    stratHl.check(coins, i);

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
