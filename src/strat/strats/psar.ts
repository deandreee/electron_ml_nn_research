import { CoinList, CoinData, AdviceObj } from "../types";
import { makeid } from "../makeid";
import { getCoinPctChange, getPctChange } from "../utils";
import { massBuy, massSell } from "../massTrade";
import { pctChange } from "./ind/pctChange";

type Trend = "up" | "down" | null;
let trend: Trend = null;

const hasRsiBeen = (
  coins: CoinList,
  i: number,
  iBefore: number,
  rsi: number,
  comparison: "gt" | "lt"
) => {
  const candles = coins.BTC.candles.slice(iBefore, i);
  for (let x of candles) {
    if (comparison === "gt" && x.ind.rsi > rsi) {
      return true;
    }
    if (comparison === "lt" && x.ind.rsi < rsi) {
      return true;
    }
  }

  return false;
};

export const check = (coins: CoinList, i: number) => {
  const prevCandle = coins.BTC.candles[i - 1];
  const candle = coins.BTC.candles[i];

  // basically stoploss for now
  const limitsStoploss = [
    { mins: 1, pct: 0.5 },
    { mins: 2, pct: -1 },
    { mins: 10, pct: -1 },
    { mins: 30, pct: -2 },
    { mins: 60, pct: -2 }
  ];

  if (pctChange(coins.BTC, i, limitsStoploss)) {
    massSell(coins, i, "stoploss");
    trend = "down";
  }

  // if (
  //   new Date(candle.start * 1000).toISOString() === "2018-06-02T06:25:00.000Z"
  // ) {
  //   debugger;
  // }

  if (
    trend === "up" &&
    candle.ind.psar < prevCandle.ind.psar &&
    hasRsiBeen(coins, i, i - 20, 70, "gt")
  ) {
    massSell(coins, i, `psar < prevCandle`);
  } else if (
    trend === "down" &&
    candle.ind.psar > prevCandle.ind.psar &&
    hasRsiBeen(coins, i, i - 20, 20, "lt")
  ) {
    massBuy(coins, i, `psar > prevCandle`);
  }

  if (candle.ind.psar > prevCandle.ind.psar) {
    trend = "up";
  } else {
    trend = "down";
  }
};
