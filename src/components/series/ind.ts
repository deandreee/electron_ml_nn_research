import { CoinList, Candle, CandleProp } from "../../strat/types";
import { config } from "../../strat/config";
import { options } from "../options";

export const seriesInd = (currentProp: CandleProp, coins: CoinList) => {
  const seriesPsar = {
    ...options.series[0],
    color: "lightblue",
    data: coins[config.leadCoin].candles.map(
      x => x && [x.start * 1000, x.ind.psar]
    ),
    name: "PSAR",
    large: true,
    sampling: "average",
    lineStyle: {
      type: "dotted"
    },
    symbol: "none"
  };

  const seriesRsi = {
    ...options.series[0],
    color: "red",
    data: coins[config.leadCoin].candles.map(
      x => x && [x.start * 1000, x.ind.rsi]
    ),
    name: "RSI",
    xAxisIndex: 1,
    yAxisIndex: 1,
    large: true,
    sampling: "average",
    symbol: "none"
  };

  const seriesVixFix = {
    ...options.series[0],
    color: "red",
    data: coins[config.leadCoin].candles.map(
      x => x && [x.start * 1000, x.ind.vixFix]
    ),
    name: "VixFix",
    xAxisIndex: 1,
    yAxisIndex: 1,
    large: true,
    sampling: "average",
    symbol: "none"
  };

  const seriesHlValid = {
    ...options.series[0],
    color: "green",
    data: coins[config.leadCoin].candles.map(
      x => x && [x.start * 1000, x.ind.hlTrueRange.valid]
    ),
    name: "HlValid",
    xAxisIndex: 1,
    yAxisIndex: 1,
    large: true,
    sampling: "average",
    symbol: "none"
  };

  const hlMax = coins[config.leadCoin].candles.map(
    x => x && [x.start * 1000, x.ind.hlTrueRange.runningMax]
  );

  const hlMin = coins[config.leadCoin].candles.map(
    x => x && [x.start * 1000, x.ind.hlTrueRange.runningMin]
  );

  const seriesHlTrueRange = {
    ...options.series[0],
    type: "scatter",
    symbolSize: 10,
    color: "purple",
    data: hlMax.concat(hlMin),
    name: "HlTrueRange",
    large: true,
    sampling: "average"
    // symbol: "none"
  };

  return [
    // seriesRsi,
    // seriesPsar,

    seriesHlTrueRange,
    seriesVixFix
    // seriesHlValid // displays really badly due to all the interruptions
  ];
};

// const seriesVolume = {
//   type: "bar",
//   color: "red",
//   data: coins[config.leadCoin].candles.map(x => [x.start * 1000, x.volume]),
//   name: "Volume",
//   xAxisIndex: 1,
//   yAxisIndex: 1,
//   large: true,
//   sampling: "average"
// };
