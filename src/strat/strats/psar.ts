import { CoinList } from "../types";
import { massBuy, massSell } from "../massTrade";
import { pctChange } from "./ind/pctChange";
import { config } from "../config";

type Trend = "up" | "down" | null;
let trend: Trend = null;

// don't allow to trade if have been stoplossed
let stoplossCooldown = 0;

const hasRsiBeen = (coins: CoinList, i: number, iBefore: number, rsi: number, comparison: "gt" | "lt") => {
  const candles = coins[config.leadCoin].candles.slice(iBefore, i);
  for (let x of candles) {
    if (comparison === "gt" && x.ind.rsi60x10 > rsi) {
      return true;
    }
    if (comparison === "lt" && x.ind.rsi60x10 < rsi) {
      return true;
    }
  }

  return false;
};

export const check = (coins: CoinList, i: number) => {
  const prevCandle = coins[config.leadCoin].candles[i - 1];
  const candle = coins[config.leadCoin].candles[i];

  // basically stoploss for now
  const limitsStoploss = [
    { mins: 1, pct: -0.5 },
    { mins: 2, pct: -1 },
    { mins: 10, pct: -1 },
    { mins: 30, pct: -2 },
    { mins: 60, pct: -2 }
  ];

  const quickPctChange = pctChange(coins[config.leadCoin], i, limitsStoploss);

  if (stoplossCooldown > 0) {
    stoplossCooldown--;
  } else if (quickPctChange) {
    massSell(coins, i, `stoploss | ${quickPctChange}`);
    stoplossCooldown = 5;
  } else if (trend === "up" && candle.ind.psar < prevCandle.ind.psar && hasRsiBeen(coins, i, i - 20, 70, "gt")) {
    massSell(coins, i, `psar < prevCandle`);
  } else if (trend === "down" && candle.ind.psar > prevCandle.ind.psar && hasRsiBeen(coins, i, i - 20, 20, "lt")) {
    massBuy(coins, i, `psar > prevCandle`);
  }

  // can't return, need to keep this
  if (candle.ind.psar > prevCandle.ind.psar) {
    trend = "up";
  } else {
    trend = "down";
  }
};
