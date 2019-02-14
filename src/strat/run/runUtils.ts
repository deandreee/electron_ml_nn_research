import { CorrCandles } from "../corr/CorrCandles";
import { minBy, maxBy, padEnd, meanBy, sumBy } from "lodash";
import { round2 } from "../utils";
import * as daterange from "../daterange";
import { ClasifResults, RegResults } from "../ml/mlEvaluate";
import { EvalResults } from "../ml/mlXGClass";

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
    JJASON: {},
    JunJulAugSep: {},
    AugSep: {},
    JunJul: {},
    NovDump: {},
    JunNov: {},
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

export const genRanges_FastMiniTest = () => {
  return [train(daterange.Jul), daterange.Aug];
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

export const genRanges_JJASON = () => {
  return [train(daterange.JJASON), daterange.Dec, daterange.Jan19];
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
  if (results[0].clasifResults) {
    return { clasifResults: calcAvgResultsClasif(results.map(x => x.clasifResults)) };
  } else {
    return { regResults: calcAvgResultsReg(results.map(x => x.regResults)) };
  }
};

export const calcAvgResultsClasif = (results: ClasifResults[]) => {
  const avg: ClasifResults = {
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

export const calcAvgResultsReg = (results: RegResults[]) => {
  const avg: RegResults = {
    mse: meanBy(results, x => x.mse),
    r2: meanBy(results, x => x.r2),
    evalCorr: {
      r2: meanBy(results, x => x.evalCorr.r2),
      corr: meanBy(results, x => x.evalCorr.corr)
    }
  };

  return avg;
};
