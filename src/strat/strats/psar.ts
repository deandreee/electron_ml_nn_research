import { CoinList, CoinData, AdviceObj } from "../types";
import { makeid } from "../makeid";
import { getCoinPctChange, getPctChange } from "../utils";
import { massBuy, massSell } from "../massTrade";

type Trend = "up" | "down" | null;
let trend: Trend = null;

export const check = (coins: CoinList, i: number) => {
  const prevCandle = coins.BTC.candles[i - 1];
  const candle = coins.BTC.candles[i];

  // if (
  //   new Date(candle.start * 1000).toISOString() === "2018-06-02T06:25:00.000Z"
  // ) {
  //   debugger;
  // }

  if (trend === "up" && candle.ind.psar < prevCandle.ind.psar) {
    massSell(coins, i);
  } else if (trend === "down" && candle.ind.psar > prevCandle.ind.psar) {
    massBuy(coins, i);
  }

  if (candle.ind.psar > prevCandle.ind.psar) {
    trend = "up";
  } else {
    trend = "down";
  }
};
