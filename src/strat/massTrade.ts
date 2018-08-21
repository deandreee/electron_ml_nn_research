import { makeid } from "./makeid";
import { CoinList, CoinData, AdviceObj } from "./types";

export const massBuy = (coins: CoinList, i: number) => {
  for (let key in coins) {
    coins[key].trader.processAdvice(
      {
        id: makeid(6),
        date: new Date(coins[key].candles[i].start * 1000),
        recommendation: "long"
      } as AdviceObj,
      coins[key].candles[i]
    );
  }
};

export const massSell = (coins: CoinList, i: number) => {
  for (let key in coins) {
    coins[key].trader.processAdvice(
      {
        id: makeid(6),
        date: new Date(coins[key].candles[i].start * 1000),
        recommendation: "short"
      } as AdviceObj,
      coins[key].candles[i]
    );
  }
};
