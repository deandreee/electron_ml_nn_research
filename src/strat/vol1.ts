import { times } from "lodash";
import { CoinList, CoinData, AdviceObj } from "./types";
import { getCoinPctChange, getPctChange } from "./utils";
import { PaperTrader } from "./gekko/PaperTrader";
import { makeid } from "./makeid";
import { RSI, PSAR } from "technicalindicators";
import { stratPump, stratPsar, stratHl, stratLinReg } from "./strats";
import {
  HlTrueRange,
  XmPsar,
  XmRsi,
  VixFix,
  ZLEMA,
  HMA,
  LRC,
  TWIGGS3,
  XmBase,
  PSAR2
} from "./strats/ind";
import { config } from "./config";
import { LRCChannel } from "./strats/ind/LRCChannel";

export const vol1 = (coins: CoinList) => {
  let rsi = new RSI({ period: 15, values: [] });
  let psar = new PSAR2();
  let xmRsi = new XmRsi(30, 15);
  let hlTrueRange = new HlTrueRange(1, 25);
  let vixFix = new VixFix({ pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 });
  let zlema = new ZLEMA(15);
  let hma = new HMA(15);
  let lrc60 = new LRC(60);
  let lrc120 = new LRC(120);
  let lrc240 = new LRC(240);
  let lrcChannel = new LRCChannel(60, 1, -1);
  let twiggs = new TWIGGS3(21);
  let warmup = 30 * 15; // min
  const leadCoin = coins[config.leadCoin];

  const xmPsar = new XmBase(5, times(5).map(x => new PSAR2()));
  const xmTwiggs = new XmBase(10, times(10).map(x => new TWIGGS3(21)));
  const xmZlema = new XmBase(10, times(10).map(x => new ZLEMA(10)));
  const xmVixFix = new XmBase(
    10,
    times(10).map(
      x => new VixFix({ pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 })
    )
  );

  for (let key in coins) {
    coins[key].trader = new PaperTrader(coins[key].candles[60]);
  }

  for (let i = 0; i < leadCoin.candles.length; i++) {
    // if (leadCoin.candles[i].volume === 0) {
    //   console.log(
    //     "volume 0",
    //     new Date(leadCoin.candles[i].start * 1000).toISOString()
    //   );
    // }

    leadCoin.candles[i].ind = {
      rsi: xmRsi.update(leadCoin.candles[i]),
      psar: psar.update(leadCoin.candles[i]),
      xmPsar: xmPsar.update(leadCoin.candles[i]),
      hlTrueRange: hlTrueRange.update(leadCoin.candles[i]),
      vixFix: vixFix.update(leadCoin.candles[i]),
      xmVixFix: xmVixFix.update(leadCoin.candles[i]),
      zlema: xmZlema.update(leadCoin.candles[i]),
      hma: hma.update(leadCoin.candles[i]),
      lrc60: lrc60.update(leadCoin.candles[i].close),
      lrc120: lrc120.update(leadCoin.candles[i].close),
      lrc240: lrc240.update(leadCoin.candles[i].close),
      lrcChannel: lrcChannel.update(leadCoin.candles[i].close),
      twiggs: twiggs.update(leadCoin.candles[i]),
      xmTwiggs: xmTwiggs.update(leadCoin.candles[i])
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

    leadCoin.candles[i].features = getFeatures(
      leadCoin,
      i,
      leadCoin.candles[i].ind.rsi!
    );
    // leadCoin.candles[i].label = getFutureResult(leadCoin, i) > 5 ? 1 : -1;
    leadCoin.candles[i].label = leadCoin.candles[i].label =
      // getCoinPctChange(leadCoin, i + 10, i) > 0 ? 1 : 0;
      // getCoinPctChange(leadCoin, i + 30, i) > 0.5 ? 1 : 0;
      getCoinPctChange(leadCoin, i + 30, i) > 1 ? 1 : 0;

    leadCoin.candles[i].pctChange60m = getCoinPctChange(leadCoin, i + 30, i);

    // stratPump.check(coins, i);
    // stratPsar.check(coins, i);
    // stratHl.check(coins, i);
    stratLinReg.check(coins, i);
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
