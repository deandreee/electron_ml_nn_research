import { Candle, CandleProp } from "../../strat/types";
import { options } from "../options";
// import { EXTENDED_COUNT } from "../../strat/corr/calcBatched";
import { CorrCandles } from "../../strat/corr/CorrCandles";

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

const baseScatter = {
  ...base,
  symbol: "pin", // https://ecomfe.github.io/echarts-doc/public/en/option.html#series-scatter.symbol
  large: true,
  sampling: "average",
  type: "scatter",
  symbolSize: 2
};

type fnGetInd = (x: Candle) => any;
type fnGetIndValue = (x: Candle) => number;

const data = (coin: CorrCandles, fn: fnGetIndValue) => {
  return coin.candlesActual.map(x => x && [x.start * 1000, fn(x)]);
};

const hasIndicator = (coin: CorrCandles, fn: fnGetInd) => {
  const candles = coin.candlesActual;
  // return fn(candles[candles.length - EXTENDED_COUNT - 1]) !== undefined; // quick fix, not sure about the number
  return fn(candles[candles.length - 1]) !== undefined; // quick fix, not sure about the number
};

export const seriesInd = (currentProp: CandleProp, coin: CorrCandles) => {
  const series = [];

  if (hasIndicator(coin, x => x.ind.psar)) {
    series.push({
      ...base,
      color: "lightblue",
      data: data(coin, x => x.ind.psar),
      name: "PSAR"
    });
  }

  if (hasIndicator(coin, x => x.ind.xmPsar)) {
    series.push({
      ...baseDotted,
      color: "lightblue",
      data: data(coin, x => x.ind.xmPsar),
      name: "XmPSAR"
    });
  }

  if (hasIndicator(coin, x => x.ind.zlema60Fast)) {
    series.push({
      ...baseDotted,
      color: "lightblue",
      data: data(coin, x => x.ind.zlema60Fast),
      name: "zlema60Fast"
    });
  }

  if (hasIndicator(coin, x => x.ind.hma)) {
    series.push({
      ...baseDotted,
      color: "green",
      data: data(coin, x => x.ind.hma),
      name: "HMA"
    });
  }

  if (hasIndicator(coin, x => x.ind.lrc60)) {
    series.push({
      ...baseDotted,
      color: "red",
      data: data(coin, x => x.ind.lrc60),
      name: "LRC60"
    });
  }

  if (hasIndicator(coin, x => x.ind.lrc120)) {
    series.push({
      ...baseDotted,
      color: "green",
      data: data(coin, x => x.ind.lrc120),
      name: "LRC120"
    });
  }

  if (hasIndicator(coin, x => x.ind.lrc240)) {
    series.push({
      ...baseDotted,
      color: "blue",
      data: data(coin, x => x.ind.lrc240),
      name: "LRC240"
    });
  }

  if (hasIndicator(coin, x => x.ind.lrcChannel)) {
    series.push({
      ...baseDotted,
      color: "yellow",
      data: data(coin, x => x.ind.lrcChannel && x.ind.lrcChannel.up),
      name: "LRC"
    });
  }

  if (hasIndicator(coin, x => x.ind.lrcChannel)) {
    series.push({
      ...baseDotted,
      color: "yellow",
      data: data(coin, x => x.ind.lrcChannel && x.ind.lrcChannel.down),
      name: "LRC"
    });
  }

  if (hasIndicator(coin, x => x.ind.vixFix)) {
    series.push({
      ...base,
      color: "red",
      data: data(coin, x => x.ind.vixFix.x30.a),
      name: "vixFix30",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coin, x => x.ind.vixFix)) {
    series.push({
      ...base,
      color: "red",
      data: data(coin, x => x.ind.vixFix.x60.a),
      name: "vixFix60",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coin, x => x.ind.twiggs)) {
    series.push({
      ...base,
      color: "red",
      data: data(coin, x => x.ind.twiggs),
      name: "TWIGGS",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coin, x => x.ind.xmTwiggs)) {
    series.push({
      ...baseDotted,
      color: "red",
      data: data(coin, x => x.ind.xmTwiggs),
      name: "XmTWIGGS",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coin, x => x.ind.hlTrueRange)) {
    series.push({
      ...base,
      color: "green",
      data: data(coin, x => x.ind.hlTrueRange && x.ind.hlTrueRange.valid),
      name: "HlValid",
      xAxisIndex: 1,
      yAxisIndex: 1
    });

    const hlMax = coin.candlesActual.map(x => x && [x.start * 1000, x.ind.hlTrueRange && x.ind.hlTrueRange.runningMax]);

    const hlMin = coin.candlesActual.map(x => x && [x.start * 1000, x.ind.hlTrueRange && x.ind.hlTrueRange.runningMin]);

    series.push({
      ...base,
      type: "scatter",
      symbolSize: 10,
      color: "purple",
      data: hlMax.concat(hlMin),
      name: "HlTrueRange"
    });
  }

  if (hasIndicator(coin, x => x.ind.kalman)) {
    series.push({
      ...baseDotted,
      color: "lightblue",
      data: data(coin, x => x.ind.kalman),
      name: "Kalman"
    });
  }

  if (hasIndicator(coin, x => x.ind.aroon)) {
    series.push({
      ...base,
      color: "green",
      data: data(coin, x => x.ind.aroon && x.ind.aroon.up),
      name: "Aroon",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coin, x => x.ind.aroon)) {
    series.push({
      ...base,
      color: "red",
      data: data(coin, x => x.ind.aroon && x.ind.aroon.down),
      name: "Aroon",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  // const flash = "path://M7,2V13H10V22L17,10H13L17,2H7Z";
  if (hasIndicator(coin, x => x.pctChange60m)) {
    series.push({
      ...base,
      color: "red",
      name: "pctChange",
      data: coin.candlesActual.filter(x => x.pctChange60m < -1).map(x => [x.start * 1000, x.close + x.close * 0.005])
    });
  }

  if (hasIndicator(coin, x => x.pctChange && x.pctChange._1d)) {
    series.push({
      ...base,
      color: "green",
      name: "pctChange_1d",
      data: data(coin, x => x.pctChange && x.pctChange._1d),
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coin, x => x.pctChange && x.pctChange._4d)) {
    series.push({
      ...base,
      color: "blue",
      name: "pctChange_4d",
      data: data(coin, x => x.pctChange && x.pctChange._4d),
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coin, x => x.pctChange && x.pctChange._7d)) {
    series.push({
      ...base,
      color: "red",
      name: "pctChange_7d",
      data: data(coin, x => x.pctChange && x.pctChange._7d),
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coin, x => x.ind.rsi)) {
    series.push({
      ...base,
      // type: "scatter",
      // symbol: flash,
      // symbolSize: 10,
      color: "red",
      // data: data(coins, x => x.ind.rsi),
      data: coin.candlesActual
        // .filter(x => x && x.ind.rsi > 80)
        .map(x => x && [x.start * 1000, x.ind.rsi.x60.p10 > 80 ? x.ind.rsi.x60.p10 : null]),
      name: "RSI",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coin, x => x.pctChange.trippleBarriers)) {
    series.push({
      ...baseScatter,
      color: "green",
      data: coin.candlesActual.map(x => x && [x.start * 1000, x.pctChange.trippleBarriers.two === 2 ? x.close : null]),
      name: "TPB_TWO"
    });

    series.push({
      ...baseScatter,
      color: "red",
      data: coin.candlesActual.map(x => x && [x.start * 1000, x.pctChange.trippleBarriers.two === 0 ? x.close : null]),
      name: "TPB_TWO"
    });

    series.push({
      ...baseScatter,
      color: "green",
      data: coin.candlesActual.map(x => x && [x.start * 1000, x.pctChange.trippleBarriers.five === 2 ? x.close : null]),
      name: "TPB_FIVE"
    });

    series.push({
      ...baseScatter,
      color: "red",
      data: coin.candlesActual.map(x => x && [x.start * 1000, x.pctChange.trippleBarriers.five === 0 ? x.close : null]),
      name: "TPB_FIVE"
    });
  }

  if (hasIndicator(coin, x => x.ind.bbands)) {
    series.push({
      ...base,
      color: "green",
      data: coin.candlesActual.map(x => x && [x.start * 1000, x.ind.bbands.x120.p30_dev3.lower]),
      name: "bbands.x120.p30_dev3"
    });

    series.push({
      ...base,
      color: "green",
      data: coin.candlesActual.map(x => x && [x.start * 1000, x.ind.bbands.x120.p30_dev3.upper]),
      name: "bbands.x120.p30_dev3"
    });

    series.push({
      ...baseScatter,
      color: "green",
      symbol: "arrow",
      symbolSize: 10,
      data: coin.candlesActual.map((x, i) => {
        if (!x) {
          return null;
        }
        const prev = coin.getPrev(i, 1);
        const curr = x;

        const indPrev = prev.ind.bbands.x120.p30_dev3;
        const indCurr = curr.ind.bbands.x120.p30_dev3;

        // hit lower
        if (prev.close > indPrev.lower && curr.close < indCurr.lower) {
          return [x.start * 1000, indCurr.lower];
        }
        return null;
      }),
      name: "bbands.x120.p30_dev3[HIT]"
    });
  }

  return series;
};

export const seriesPredicted = (coin: CorrCandles, predicted: number[]) => {
  return [
    {
      ...base,
      type: "scatter",
      color: "red",
      data: predicted.map((x, i) => [coin.candlesActual[i].start * 1000, x]),
      name: "predicted",
      xAxisIndex: 1,
      yAxisIndex: 1
    }
  ];
};

// const seriesVolume = {
//   type: "bar",
//   color: "red",
//   data: coins[config.leadCoin].candlesActual.map(x => [x.start * 1000, x.volume]),
//   name: "Volume",
//   xAxisIndex: 1,
//   yAxisIndex: 1,
//   large: true,
//   sampling: "average"
// };
