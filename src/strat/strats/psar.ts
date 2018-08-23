import { CoinList, CoinData, AdviceObj } from "../types";
import { makeid } from "../makeid";
import { getCoinPctChange, getPctChange } from "../utils";
import { massBuy, massSell } from "../massTrade";

type Trend = "up" | "down" | null;
let trend: Trend = null;

const hasRsiBeen = (
  coins: CoinList,
  i: number,
  iBefore: number,
  rsi: number,
  comparison: "gt" | "lt"
) => {
  const candles = coins.EOS.candles.slice(iBefore, i);
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
  const prevCandle = coins.EOS.candles[i - 1];
  const candle = coins.EOS.candles[i];

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
    massSell(coins, i);
  } else if (
    trend === "down" &&
    candle.ind.psar > prevCandle.ind.psar &&
    hasRsiBeen(coins, i, i - 20, 20, "lt")
  ) {
    massBuy(coins, i);
  }

  if (candle.ind.psar > prevCandle.ind.psar) {
    trend = "up";
  } else {
    trend = "down";
  }
};
