import { flatten } from "lodash";
import { cryptonians, Signal } from "../../strat/signals/cryptonians";
import { CoinList, Candle, CandleProp } from "../../strat/types";

const getCandleForSignal = (coins: CoinList, signal: Signal): Candle | null => {
  const candles = coins[signal.asset].candles;
  for (let i = 0; i < candles.length - 1; i++) {
    if (
      candles[i].start * 1000 < signal.date.getTime() &&
      candles[i + 1].start * 1000 > signal.date.getTime()
    ) {
      return candles[i + 1];
    }
  }
  console.log("candle not found for signal", signal);
  return null;
};

export const seriesSignals = (currentProp: CandleProp, coins: CoinList) => {
  return flatten(
    Object.keys(coins).map(key => {
      const trades = cryptonians.filter(x => x.asset === key);

      const seriesTradesBuy = {
        symbolSize: 10,
        data: trades
          .filter(x => x.advice === "long")
          .map(x => {
            const candle = getCandleForSignal(coins, x);
            return candle ? [x.date.getTime(), candle[currentProp]] : null;
          })
          .filter(x => !!x),
        color: "purple",
        type: "scatter",
        name: key
      };

      const seriesTradesSell = {
        symbolSize: 10,
        data: trades
          .filter(x => x.advice === "short")
          .map(x => {
            const candle = getCandleForSignal(coins, x);
            return candle ? [x.date.getTime(), candle[currentProp]] : null;
          })
          .filter(x => !!x),
        color: "lightblue",
        type: "scatter",
        name: key
      };

      return [seriesTradesBuy, seriesTradesSell];
    })
  );
};
