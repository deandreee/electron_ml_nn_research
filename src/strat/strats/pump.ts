import { CoinList, CoinData, AdviceObj } from "../types";
import { makeid } from "../makeid";
import { getCoinPctChange, getPctChange } from "../utils";
import { massBuy, massSell } from "../massTrade";

export const check = (coins: CoinList, i: number) => {
  const change2m = getCoinPctChange(coins.BTC, i, i - 2);
  const change10m = getCoinPctChange(coins.BTC, i, i - 10);
  const change30m = getCoinPctChange(coins.BTC, i, i - 30);
  const change60m = getCoinPctChange(coins.BTC, i, i - 60);

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
