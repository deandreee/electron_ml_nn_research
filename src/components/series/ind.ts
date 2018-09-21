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

type fnGetInd = (x: Candle) => any;
type fnGetIndValue = (x: Candle) => number;

const data = (coins: CoinList, fn: fnGetIndValue) => {
  return coins[config.leadCoin].candles.map(x => x && [x.start * 1000, fn(x)]);
};

const hasIndicator = (coins: CoinList, fn: fnGetInd) => {
  const candles = coins[config.leadCoin].candles;
  return fn(candles[candles.length - 1000]) !== undefined; // quick fix, not sure about the number
};

export const seriesInd = (currentProp: CandleProp, coins: CoinList) => {
  const series = [];

  if (hasIndicator(coins, x => x.ind.psar)) {
    series.push({
      ...base,
      color: "lightblue",
      data: data(coins, x => x.ind.psar),
      name: "PSAR"
    });
  }

  if (hasIndicator(coins, x => x.ind.xmPsar)) {
    series.push({
      ...baseDotted,
      color: "lightblue",
      data: data(coins, x => x.ind.xmPsar),
      name: "XmPSAR"
    });
  }

  if (hasIndicator(coins, x => x.ind.zlema)) {
    series.push({
      ...baseDotted,
      color: "lightblue",
      data: data(coins, x => x.ind.zlema),
      name: "ZLEMA"
    });
  }

  if (hasIndicator(coins, x => x.ind.hma)) {
    series.push({
      ...baseDotted,
      color: "green",
      data: data(coins, x => x.ind.hma),
      name: "HMA"
    });
  }

  if (hasIndicator(coins, x => x.ind.lrc60)) {
    series.push({
      ...baseDotted,
      color: "red",
      data: data(coins, x => x.ind.lrc60 && x.ind.lrc60.result),
      name: "LRC60"
    });
  }

  if (hasIndicator(coins, x => x.ind.lrc120)) {
    series.push({
      ...baseDotted,
      color: "green",
      data: data(coins, x => x.ind.lrc120 && x.ind.lrc120.result),
      name: "LRC120"
    });
  }

  if (hasIndicator(coins, x => x.ind.lrc240)) {
    series.push({
      ...baseDotted,
      color: "blue",
      data: data(coins, x => x.ind.lrc240 && x.ind.lrc240.result),
      name: "LRC240"
    });
  }

  if (hasIndicator(coins, x => x.ind.lrcChannel)) {
    series.push({
      ...baseDotted,
      color: "yellow",
      data: data(coins, x => x.ind.lrcChannel && x.ind.lrcChannel.up),
      name: "LRC"
    });
  }

  if (hasIndicator(coins, x => x.ind.lrcChannel)) {
    series.push({
      ...baseDotted,
      color: "yellow",
      data: data(coins, x => x.ind.lrcChannel && x.ind.lrcChannel.down),
      name: "LRC"
    });
  }

  if (hasIndicator(coins, x => x.ind.lrc60)) {
    series.push({
      ...base,
      color: "red",
      data: data(coins, x => x.ind.lrc60 && x.ind.lrc60.slope),
      name: "LRC",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coins, x => x.ind.lrc60)) {
    series.push({
      ...base,
      color: "green",
      data: data(coins, x => x.ind.lrc60 && x.ind.lrc60.intercept),
      name: "LRC",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coins, x => x.ind.vixFix)) {
    series.push({
      ...base,
      color: "red",
      data: data(coins, x => x.ind.vixFix),
      name: "VixFix",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coins, x => x.ind.xmVixFix)) {
    series.push({
      ...base,
      color: "red",
      data: data(coins, x => x.ind.xmVixFix),
      name: "XmVixFix",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coins, x => x.ind.twiggs)) {
    series.push({
      ...base,
      color: "red",
      data: data(coins, x => x.ind.twiggs),
      name: "TWIGGS",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coins, x => x.ind.xmTwiggs)) {
    series.push({
      ...baseDotted,
      color: "red",
      data: data(coins, x => x.ind.xmTwiggs),
      name: "XmTWIGGS",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coins, x => x.ind.hlTrueRange)) {
    series.push({
      ...base,
      color: "green",
      data: data(coins, x => x.ind.hlTrueRange && x.ind.hlTrueRange.valid),
      name: "HlValid",
      xAxisIndex: 1,
      yAxisIndex: 1
    });

    const hlMax = coins[config.leadCoin].candles.map(
      x =>
        x && [x.start * 1000, x.ind.hlTrueRange && x.ind.hlTrueRange.runningMax]
    );

    const hlMin = coins[config.leadCoin].candles.map(
      x =>
        x && [x.start * 1000, x.ind.hlTrueRange && x.ind.hlTrueRange.runningMin]
    );

    series.push({
      ...base,
      type: "scatter",
      symbolSize: 10,
      color: "purple",
      data: hlMax.concat(hlMin),
      name: "HlTrueRange"
    });
  }

  if (hasIndicator(coins, x => x.ind.kalman)) {
    series.push({
      ...baseDotted,
      color: "lightblue",
      data: data(coins, x => x.ind.kalman),
      name: "Kalman"
    });
  }

  if (hasIndicator(coins, x => x.ind.aroon)) {
    series.push({
      ...base,
      color: "green",
      data: data(coins, x => x.ind.aroon && x.ind.aroon.up),
      name: "Aroon",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coins, x => x.ind.aroon)) {
    series.push({
      ...base,
      color: "red",
      data: data(coins, x => x.ind.aroon && x.ind.aroon.down),
      name: "Aroon",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  const flash = "path://M7,2V13H10V22L17,10H13L17,2H7Z";
  if (hasIndicator(coins, x => x.pctChange60m)) {
    series.push({
      ...base,
      type: "scatter",
      symbol: flash,
      symbolSize: 15,
      color: "red",
      name: "pctChange",
      data: coins[config.leadCoin].candles
        .filter(x => x.pctChange60m < -1)
        .map(x => [x.start * 1000, x.close + x.close * 0.005])
    });
  }

  if (hasIndicator(coins, x => x.ind.rsi)) {
    series.push({
      ...base,
      // type: "scatter",
      // symbol: flash,
      // symbolSize: 10,
      color: "red",
      // data: data(coins, x => x.ind.rsi),
      data: coins[config.leadCoin].candles
        // .filter(x => x && x.ind.rsi > 80)
        .map(x => x && [x.start * 1000, x.ind.rsi > 80 ? x.ind.rsi : null]),
      name: "RSI",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  return series;
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
