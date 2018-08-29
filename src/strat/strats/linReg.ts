import { CoinList, CoinData, AdviceObj, Candle } from "../types";
import { massBuy, massSell } from "../massTrade";
import { config } from "../config";

let actionCooldown = 0;

export const check = (coins: CoinList, i: number) => {
  const candle = coins[config.leadCoin].candles[i];

  // if (actionCooldown-- > 0) {
  //   return;
  // }

  // if (candle.ind.vixFix < 1) {
  //   return; // do nuttin
  // }

  // if (candle.ind.lrc > candle.close + 50) {
  // if (candle.close > candle.ind.lrc120) {
  if (candle.ind.lrc60 > candle.ind.lrc240) {
    massBuy(coins, i, "lrc >");
    actionCooldown = 5;
  } else {
    massSell(coins, i, "lrc <");
    actionCooldown = 5;
  }
};
