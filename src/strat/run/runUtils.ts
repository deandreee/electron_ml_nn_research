import { CorrCandles } from "../corr/CorrCandles";
import { minBy, maxBy, padEnd, meanBy, sumBy } from "lodash";
import { round2 } from "../utils";
import * as daterange from "../daterange";
import { EvalResults } from "../ml/mlEvaluate";

interface Predictions {
  [name: string]: PredictionMonth;
}

interface PredictionMonth {
  [name: string]: number[];
}

export const getPredictionsTemplate = () => {
  const predictions: Predictions = {
    JJAS: {},
    MJJAS: {},
    JunJulAugSep: {},
    AugSep: {},
    JunJul: {},
    NovDump: {},
    Jun: {},
    Jul: {},
    Aug: {},
    Sep: {},
    Oct: {},
    Nov: {},
    Dec: {},
    Jan19: {}
  };
  return predictions;
};

export const getIndMinMax = (candles: CorrCandles) => {
  {
    const min = minBy(candles.candlesActual, x => x.ind.macd.x30.sig9.histo);
    const max = maxBy(candles.candlesActual, x => x.ind.macd.x30.sig9.histo);
    console.log(
      padEnd("macd30", 10),
      padEnd(round2(min.ind.macd.x30.sig9.histo).toString(), 5),
      padEnd(round2(max.ind.macd.x30.sig9.histo).toString(), 5)
    );
  }

  {
    const min = minBy(candles.candlesActual, x => x.ind.macd.x60.sig9.histo);
    const max = maxBy(candles.candlesActual, x => x.ind.macd.x60.sig9.histo);
    console.log(
      padEnd("macd60", 10),
      padEnd(round2(min.ind.macd.x60.sig9.histo).toString(), 5),
      padEnd(round2(max.ind.macd.x60.sig9.histo).toString(), 5)
    );
  }

  {
    const min = minBy(candles.candlesActual, x => x.ind.macd.x120.sig9.histo);
    const max = maxBy(candles.candlesActual, x => x.ind.macd.x120.sig9.histo);
    console.log(
      padEnd("macd120", 10),
      padEnd(round2(min.ind.macd.x120.sig9.histo).toString(), 5),
      padEnd(round2(max.ind.macd.x120.sig9.histo).toString(), 5)
    );
  }

  {
    const min = minBy(candles.candlesActual, x => x.ind.macd.x240.sig9.histo);
    const max = maxBy(candles.candlesActual, x => x.ind.macd.x240.sig9.histo);
    console.log(
      padEnd("macd240", 10),
      padEnd(round2(min.ind.macd.x240.sig9.histo).toString(), 5),
      padEnd(round2(max.ind.macd.x240.sig9.histo).toString(), 5)
    );
  }
};

const train = (range: daterange.DateRange) => {
  return { ...range, isTrain: true };
};

export const genRangesFull = () => {
  return [
    train(daterange.JunJulAugSep),
    train(daterange.Jun),
    train(daterange.Jul),
    train(daterange.Aug),
    train(daterange.Sep),
    daterange.Oct,
    daterange.Nov,
    daterange.Dec
  ];
};

export const genRanges_FastMiniTest = () => {
  return [daterange.NovDump, daterange.Jun];
};

export const genRangesLast1_AugSep = () => {
  return [
    train(daterange.AugSep),
    daterange.Jun,
    daterange.Jul,
    train(daterange.Aug),
    train(daterange.Sep),
    daterange.Oct,
    daterange.Nov
  ];
};

export const genRangesLast2_AugSepMini = () => {
  return [train(daterange.AugSep), daterange.Oct, daterange.Nov];
};

export const genRanges_MJJAS = () => {
  return [train(daterange.MayJunJulAugSep), daterange.Oct, daterange.Nov, daterange.Dec];
};

export const genRanges_JJAS = () => {
  return [train(daterange.JunJulAugSep), daterange.Oct, daterange.Nov, daterange.Dec, daterange.Jan19];
};

export const genRanges_JJ = () => {
  return [
    train(daterange.JunJul),
    train(daterange.Jun),
    train(daterange.Jul),
    daterange.Aug,
    daterange.Sep,
    daterange.Oct,
    daterange.Nov,
    daterange.Dec
  ];
};

export const genRanges_JunDec = () => {
  return [train(daterange.JunDec)];
};

export const genRanges_SepWeek = () => {
  return [train(daterange.SepWeek)];
};

export const calcAvgResults = (results: EvalResults[]) => {
  const avg: EvalResults = {
    fScore: meanBy(results, x => x.fScore),
    precision: {
      0: meanBy(results, x => x.precision[0]),
      1: meanBy(results, x => x.precision[1]),
      2: meanBy(results, x => x.precision[2])
    },
    precisionTotal: meanBy(results, x => x.precisionTotal),
    recall: {
      0: meanBy(results, x => x.recall[0]),
      1: meanBy(results, x => x.recall[1]),
      2: meanBy(results, x => x.recall[2])
    },
    recallTotal: meanBy(results, x => x.recallTotal),
    hitRate: meanBy(results, x => x.hitRate),
    bigErrorsReverse: meanBy(results, x => x.bigErrorsReverse),
    zeroHitRate: {
      predicted: sumBy(results, x => x.zeroHitRate.predicted),
      actual: sumBy(results, x => x.zeroHitRate.actual)
    },
    oneHitRate: {
      predicted: sumBy(results, x => x.oneHitRate.predicted),
      actual: sumBy(results, x => x.oneHitRate.actual)
    },
    twoHitRate: {
      predicted: sumBy(results, x => x.twoHitRate.predicted),
      actual: sumBy(results, x => x.twoHitRate.actual)
    }
  };

  return avg;
};
