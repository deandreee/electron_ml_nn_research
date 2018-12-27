import { CorrCandles } from "../corr/CorrCandles";
import { minBy, maxBy, padEnd } from "lodash";
import { round2 } from "../utils";
import * as daterange from "../daterange";

interface Predictions {
  [name: string]: PredictionMonth;
}

interface PredictionMonth {
  [name: string]: number[];
}

export const getPredictionsTemplate = () => {
  const predictions: Predictions = {
    JunJulAugSep: {},
    AugSep: {},
    JunJul: {},
    Jun: {},
    Jul: {},
    Aug: {},
    Sep: {},
    Oct: {},
    Nov: {}
  };
  return predictions;
};

export const getIndMinMax = (candles: CorrCandles) => {
  {
    const min = minBy(candles.candlesActual, "ind.macd30.histo");
    const max = maxBy(candles.candlesActual, "ind.macd30.histo");
    console.log(
      padEnd("macd30", 10),
      padEnd(round2(min.ind.macd30.histo).toString(), 5),
      padEnd(round2(max.ind.macd30.histo).toString(), 5)
    );
  }

  {
    const min = minBy(candles.candlesActual, "ind.macd60.histo");
    const max = maxBy(candles.candlesActual, "ind.macd60.histo");
    console.log(
      padEnd("macd60", 10),
      padEnd(round2(min.ind.macd60.histo).toString(), 5),
      padEnd(round2(max.ind.macd60.histo).toString(), 5)
    );
  }

  {
    const min = minBy(candles.candlesActual, "ind.macd120.histo");
    const max = maxBy(candles.candlesActual, "ind.macd120.histo");
    console.log(
      padEnd("macd120", 10),
      padEnd(round2(min.ind.macd120.histo).toString(), 5),
      padEnd(round2(max.ind.macd120.histo).toString(), 5)
    );
  }

  {
    const min = minBy(candles.candlesActual, "ind.macd240.histo");
    const max = maxBy(candles.candlesActual, "ind.macd240.histo");
    console.log(
      padEnd("macd240", 10),
      padEnd(round2(min.ind.macd240.histo).toString(), 5),
      padEnd(round2(max.ind.macd240.histo).toString(), 5)
    );
  }
};

export const genRangesFull = () => {
  return [
    daterange.JunJulAugSep,
    daterange.Jun,
    daterange.Jul,
    daterange.Aug,
    daterange.Sep,
    daterange.Oct,
    daterange.Nov
  ];
};

export const genRangesLast1_AugSep = () => {
  return [daterange.AugSep, daterange.Jun, daterange.Jul, daterange.Aug, daterange.Sep, daterange.Oct, daterange.Nov];
};

export const genRangesLast2_AugSepMini = () => {
  return [daterange.AugSep, daterange.Oct, daterange.Nov];
};

export const genRangesLast3_JunJulAugSep = () => {
  return [daterange.JunJulAugSep, daterange.Oct, daterange.Nov];
};
