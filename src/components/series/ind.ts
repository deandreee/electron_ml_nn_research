import { CoinList, Candle, CandleProp } from "../../strat/types";
import { config } from "../../strat/config";
import { options } from "../options";
import { EXTENDED } from "../../strat/corr/calc";

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
  return fn(candles[candles.length - EXTENDED - 1]) !== undefined; // quick fix, not sure about the number
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

  if (hasIndicator(coins, x => x.ind.zlema60Fast)) {
    series.push({
      ...baseDotted,
      color: "lightblue",
      data: data(coins, x => x.ind.zlema60Fast),
      name: "zlema60Fast"
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
      data: data(coins, x => x.ind.lrc60),
      name: "LRC60"
    });
  }

  if (hasIndicator(coins, x => x.ind.lrc120)) {
    series.push({
      ...baseDotted,
      color: "green",
      data: data(coins, x => x.ind.lrc120),
      name: "LRC120"
    });
  }

  if (hasIndicator(coins, x => x.ind.lrc240)) {
    series.push({
      ...baseDotted,
      color: "blue",
      data: data(coins, x => x.ind.lrc240),
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

  if (hasIndicator(coins, x => x.ind.vixFix30)) {
    series.push({
      ...base,
      color: "red",
      data: data(coins, x => x.ind.vixFix30),
      name: "vixFix30",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coins, x => x.ind.vixFix60)) {
    series.push({
      ...base,
      color: "red",
      data: data(coins, x => x.ind.vixFix60),
      name: "vixFix60",
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
      x => x && [x.start * 1000, x.ind.hlTrueRange && x.ind.hlTrueRange.runningMax]
    );

    const hlMin = coins[config.leadCoin].candles.map(
      x => x && [x.start * 1000, x.ind.hlTrueRange && x.ind.hlTrueRange.runningMin]
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

  // const flash = "path://M7,2V13H10V22L17,10H13L17,2H7Z";
  if (hasIndicator(coins, x => x.pctChange60m)) {
    series.push({
      ...base,
      color: "red",
      name: "pctChange",
      data: coins[config.leadCoin].candles
        .filter(x => x.pctChange60m < -1)
        .map(x => [x.start * 1000, x.close + x.close * 0.005])
    });
  }

  if (hasIndicator(coins, x => x.pctChange && x.pctChange._1d)) {
    series.push({
      ...base,
      color: "green",
      name: "pctChange_1d",
      data: data(coins, x => x.pctChange && x.pctChange._1d),
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coins, x => x.pctChange && x.pctChange._4d)) {
    series.push({
      ...base,
      color: "blue",
      name: "pctChange_4d",
      data: data(coins, x => x.pctChange && x.pctChange._4d),
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coins, x => x.pctChange && x.pctChange._7d)) {
    series.push({
      ...base,
      color: "red",
      name: "pctChange_7d",
      data: data(coins, x => x.pctChange && x.pctChange._7d),
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coins, x => x.ind.rsi60x10)) {
    series.push({
      ...base,
      // type: "scatter",
      // symbol: flash,
      // symbolSize: 10,
      color: "red",
      // data: data(coins, x => x.ind.rsi),
      data: coins[config.leadCoin].candles
        // .filter(x => x && x.ind.rsi > 80)
        .map(x => x && [x.start * 1000, x.ind.rsi60x10 > 80 ? x.ind.rsi60x10 : null]),
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
