import { CoinList, Candle, CandleProp } from "../../strat/types";
import { config } from "../../strat/config";
import { options } from "../options";

const base = {
  ...options.series[0],
  large: true,
  sampling: "average",

  symbol: "none"
};

const baseDotted = {
  ...base,
  lineStyle: {
    type: "dotted"
  }
};

type fnGetInd = (x: Candle) => number;

const data = (coins: CoinList, fn: fnGetInd) => {
  return coins[config.leadCoin].candles.map(x => x && [x.start * 1000, fn(x)]);
};

export const seriesInd = (currentProp: CandleProp, coins: CoinList) => {
  const seriesPsar = {
    ...base,
    color: "lightblue",
    data: data(coins, x => x.ind.psar),
    name: "PSAR"
  };

  const seriesXmPsar = {
    ...baseDotted,
    color: "lightblue",
    data: data(coins, x => x.ind.xmPsar),
    name: "XmPSAR"
  };

  const seriesZlema = {
    ...baseDotted,
    color: "lightblue",
    data: data(coins, x => x.ind.zlema),
    name: "ZLEMA"
  };

  const seriesHma = {
    ...baseDotted,
    color: "green",
    data: data(coins, x => x.ind.hma),

    name: "HMA"
  };

  const seriesLrc60 = {
    ...baseDotted,
    color: "red",
    data: data(coins, x => x.ind.lrc60.result),
    name: "LRC"
  };

  const seriesLrc120 = {
    ...baseDotted,
    color: "green",
    data: data(coins, x => x.ind.lrc120.result),
    name: "LRC"
  };

  const seriesLrc240 = {
    ...baseDotted,
    color: "blue",
    data: data(coins, x => x.ind.lrc240.result),
    name: "LRC"
  };

  const seriesLrcChannelUp = {
    ...baseDotted,
    color: "yellow",
    data: data(coins, x => x.ind.lrcChannel.up),
    name: "LRC"
  };

  const seriesLrcChannelDown = {
    ...baseDotted,
    color: "yellow",
    data: data(coins, x => x.ind.lrcChannel.down),
    name: "LRC"
  };

  const seriesLrcSlope = {
    ...base,
    color: "red",
    data: data(coins, x => x.ind.lrc60.slope),
    name: "LRC",
    xAxisIndex: 1,
    yAxisIndex: 1
  };

  const seriesLrcIntercept = {
    ...base,
    color: "green",
    data: data(coins, x => x.ind.lrc60.intercept),
    name: "LRC",
    xAxisIndex: 1,
    yAxisIndex: 1
  };

  const seriesRsi = {
    ...base,
    color: "red",
    data: data(coins, x => x.ind.rsi),
    name: "RSI",
    xAxisIndex: 1,
    yAxisIndex: 1
  };

  const seriesVixFix = {
    ...base,
    color: "red",
    data: data(coins, x => x.ind.vixFix),
    name: "VixFix",
    xAxisIndex: 1,
    yAxisIndex: 1
  };

  const seriesXmVixFix = {
    ...base,
    color: "red",
    data: data(coins, x => x.ind.xmVixFix),
    name: "XmVixFix",
    xAxisIndex: 1,
    yAxisIndex: 1
  };

  const seriesTwiggs = {
    ...base,
    color: "red",
    data: data(coins, x => x.ind.twiggs),
    name: "TWIGGS",
    xAxisIndex: 1,
    yAxisIndex: 1
  };

  const seriesXmTwiggs = {
    ...baseDotted,
    color: "red",
    data: data(coins, x => x.ind.xmTwiggs),
    name: "XmTWIGGS",
    xAxisIndex: 1,
    yAxisIndex: 1
  };

  const seriesHlValid = {
    ...base,
    color: "green",
    data: data(coins, x => x.ind.hlTrueRange.valid),
    name: "HlValid",
    xAxisIndex: 1,
    yAxisIndex: 1
  };

  const hlMax = coins[config.leadCoin].candles.map(
    x => x && [x.start * 1000, x.ind.hlTrueRange.runningMax]
  );

  const hlMin = coins[config.leadCoin].candles.map(
    x => x && [x.start * 1000, x.ind.hlTrueRange.runningMin]
  );

  const seriesHlTrueRange = {
    ...base,
    type: "scatter",
    symbolSize: 10,
    color: "purple",
    data: hlMax.concat(hlMin),
    name: "HlTrueRange"
  };

  const seriesKalman = {
    ...baseDotted,
    color: "lightblue",
    data: data(coins, x => x.ind.kalman),
    name: "Kalman"
  };

  const seriesAroonUp = {
    ...base,
    color: "green",
    data: data(coins, x => x.ind.aroon.up),
    name: "Aroon",
    xAxisIndex: 1,
    yAxisIndex: 1
  };

  const seriesAroonDown = {
    ...base,
    color: "red",
    data: data(coins, x => x.ind.aroon.down),
    name: "Aroon",
    xAxisIndex: 1,
    yAxisIndex: 1
  };

  return [
    // seriesRsi,
    seriesPsar,
    seriesXmPsar,

    seriesHlTrueRange,
    seriesVixFix,
    seriesXmVixFix,
    // seriesHlValid // displays really badly due to all the interruptions
    seriesZlema,
    seriesHma,
    seriesLrc60,
    seriesLrc120,
    seriesLrc240,
    seriesLrcChannelUp,
    seriesLrcChannelDown,
    seriesLrcSlope,
    // seriesLrcIntercept,
    seriesTwiggs,
    seriesXmTwiggs,
    seriesKalman,
    seriesAroonUp,
    seriesAroonDown
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
