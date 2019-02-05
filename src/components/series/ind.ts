import { Candle, CandleProp, Prediction } from "../../strat/types";
import { options } from "../options";
import { CorrCandles } from "../../strat/corr/CorrCandles";
import { flatten } from "lodash";

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
  symbol: "circle", // https://ecomfe.github.io/echarts-doc/public/en/option.html#series-scatter.symbol
  large: true,
  sampling: "average",
  type: "scatter",
  symbolSize: 2
};

export const grid2 = {
  xAxisIndex: 1,
  yAxisIndex: 1
};

type fnGetInd = (x: Candle) => any;
type fnGetIndValue = (x: Candle) => number;

const data = (coin: CorrCandles, fn: fnGetIndValue) => {
  return coin.candlesActual.map(x => x && [x.start * 1000, fn(x)]);
};

const hasIndicator = (coin: CorrCandles, fn: fnGetInd) => {
  const candles = coin.candlesActual;
  const val = fn(candles[candles.length - 1]);
  return val !== undefined && val !== null;
};

export const seriesInd = (currentProp: CandleProp, coin: CorrCandles) => {
  const series = [];

  if (hasIndicator(coin, x => x.ind.psar)) {
    series.push({
      ...base,
      color: "lightblue",
      data: data(coin, x => x.ind.psar.x120.p0_0001.result),
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
      data: data(coin, x => x.ind.kalman.x120.r001_q1),
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

  if (hasIndicator(coin, x => x.ind.rsi && x.ind.rsi.x60)) {
    series.push({
      ...base,
      color: "red",
      data: coin.candlesActual.map(x => x && [x.start * 1000, x.ind.rsi.x60.p10]),
      name: "rsi.x60.p10",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coin, x => x.ind.rsi && x.ind.rsi.x480)) {
    series.push({
      ...base,
      color: "red",
      data: coin.candlesActual.map(x => x && [x.start * 1000, x.ind.rsi.x480.p10]),
      name: "rsi.x480.p10",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coin, x => x.ind.rsi && x.ind.rsi.x1440)) {
    series.push({
      ...base,
      color: "red",
      data: coin.candlesActual.map(x => x && [x.start * 1000, x.ind.rsi.x1440.p10]),
      name: "rsi.x1440.p10",
      xAxisIndex: 1,
      yAxisIndex: 1
    });
  }

  if (hasIndicator(coin, x => x.pctChange.trippleBarriers)) {
    series.push({
      ...baseScatter,
      color: "green",
      data: coin.candlesActual.map(x => x && [x.start * 1000, x.pctChange.trippleBarriers.TWO === 2 ? x.close : null]),
      name: "TPB_TWO"
    });

    series.push({
      ...baseScatter,
      color: "red",
      data: coin.candlesActual.map(x => x && [x.start * 1000, x.pctChange.trippleBarriers.TWO === 0 ? x.close : null]),
      name: "TPB_TWO"
    });

    series.push({
      ...baseScatter,
      color: "green",
      data: coin.candlesActual.map(x => x && [x.start * 1000, x.pctChange.trippleBarriers.FIVE === 2 ? x.close : null]),
      name: "TPB_FIVE"
    });

    series.push({
      ...baseScatter,
      color: "red",
      data: coin.candlesActual.map(x => x && [x.start * 1000, x.pctChange.trippleBarriers.FIVE === 0 ? x.close : null]),
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

  if (hasIndicator(coin, x => x.pctChange.tripple)) {
    series.push({
      ...base,
      color: "green",
      data: coin.candlesActual.map(x => x && [x.start * 1000, x.pctChange.tripple === 2 ? x.close : null]),
      name: "trippleBarrier"
    });

    series.push({
      ...base,
      color: "red",
      data: coin.candlesActual.map(x => x && [x.start * 1000, x.pctChange.tripple === 0 ? x.close : null]),
      name: "trippleBarrier"
    });
  }

  return series;
};

const valueXpct = (value: number, pi: number) => {
  const pct = pi / 100;
  return value + value * pct;
};

export const seriesPredicted = (coin: CorrCandles, predicted: Prediction[]) => {
  return flatten(
    predicted.map((p, pi) => [
      {
        ...base,
        color: "red",
        data: p.values.map((x, i) => [
          coin.candlesActual[i].start * 1000,
          x === 0 ? valueXpct(coin.candlesActual[i].close, pi) : null
        ]),
        name: `[P]${p.name}`,
        symbolSize: 5
      },

      {
        ...base,
        color: "green",
        data: p.values.map((x, i) => [
          coin.candlesActual[i].start * 1000,
          x === 2 ? valueXpct(coin.candlesActual[i].close, pi) : null
        ]),
        name: `[P]${p.name}`,
        symbolSize: 5
      }
    ])
  );
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
