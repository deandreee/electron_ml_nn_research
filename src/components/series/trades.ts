import { flatten } from "lodash";
import { CoinList, CandleProp } from "../../strat/types";

export const seriesTrades = (currentProp: CandleProp, coins: CoinList) => {
  return flatten(
    Object.keys(coins).map(key => {
      const trades = coins[key].trader.performanceAnalyzer.tradeHistory;

      const seriesTradesBuy = {
        symbolSize: 10,
        data: trades
          .filter(x => x.action === "buy")
          .map(x => [
            x.date.getTime(),
            x.candle[currentProp],
            { reason: x.reason }
          ]),
        color: "green",
        type: "scatter",
        name: key
      };

      const seriesTradesSell = {
        symbolSize: 10,
        data: trades
          .filter(x => x.action === "sell")
          .map(x => [
            x.date.getTime(),
            x.candle[currentProp],
            { reason: x.reason }
          ]),
        color: "red",
        type: "scatter",
        name: key
      };

      return [seriesTradesBuy, seriesTradesSell];
    })
  );
};
