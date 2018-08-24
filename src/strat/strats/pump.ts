import { CoinList, CoinData, AdviceObj } from "../types";
import { makeid } from "../makeid";
import { getCoinPctChange, getPctChange } from "../utils";
import { massBuy, massSell } from "../massTrade";
import { config } from "../config";

export const check = (coins: CoinList, i: number) => {
  const coin = coins[config.leadCoin];
  const change2m = getCoinPctChange(coin, i, i - 2);
  const change10m = getCoinPctChange(coin, i, i - 10);
  const change30m = getCoinPctChange(coin, i, i - 30);
  const change60m = getCoinPctChange(coin, i, i - 60);

  if (change2m >= 1 || change10m >= 1 || change30m >= 2 || change60m >= 2) {
    massBuy(coins, i, "N/A");
  } else if (
    change2m <= -1 ||
    change10m <= -1 ||
    change30m <= -2 ||
    change60m <= -2
  ) {
    massSell(coins, i, "N/A");
  }
};
