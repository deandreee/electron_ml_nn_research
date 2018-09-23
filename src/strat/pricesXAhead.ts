import { Series } from "pandas-js";
import * as regression from "regression";
import { Candle } from "./types";
import { round2 } from "./utils";

export const pricesXAhead = (
  candlesActual: Candle[],
  candlesActualExtended: Candle[]
) => {
  const pricesXhAhead = candlesActual.map(
    (x, i) => candlesActualExtended[i + 240].close
  );
  const pricesXhAheadSeries = new Series(pricesXhAhead);

  const rsi = new Series(candlesActual.map(x => x.ind.rsi));
  const vixFix = new Series(candlesActual.map(x => x.ind.vixFix));
  const lrc60_ = new Series(candlesActual.map(x => x.ind.lrc60.result));
  const lrc120_ = new Series(candlesActual.map(x => x.ind.lrc120.result));
  const lrc240_ = new Series(candlesActual.map(x => x.ind.lrc240.result));
  const zlema_ = new Series(candlesActual.map(x => x.ind.zlema));

  console.log("rsi 10 vs prices", round2(rsi.corr(pricesXhAheadSeries)));
  console.log("vixFix 10 prices", round2(vixFix.corr(pricesXhAheadSeries)));
  console.log("lrc60_ vs prices", round2(lrc60_.corr(pricesXhAheadSeries)));
  console.log("lrc120_ vs prices", round2(lrc120_.corr(pricesXhAheadSeries)));
  console.log("lrc240 vs prices", round2(lrc240_.corr(pricesXhAheadSeries)));
  console.log("zlema_ vs prices", round2(zlema_.corr(pricesXhAheadSeries)));

  {
    const result = regression.linear(
      candlesActual
        .map(x => x.ind.lrc120.result)
        .map((x, i) => [x, pricesXhAhead[i]])
    );

    console.log("regression lrc120", result.string, "r2", result.r2);
  }

  {
    const result = regression.linear(
      candlesActual
        .map(x => x.ind.lrc240.result)
        .map((x, i) => [x, pricesXhAhead[i]])
    );

    console.log("regression lrc240", result.string, "r2", result.r2);
  }

  {
    const result = regression.linear(
      candlesActual.map(x => x.ind.rsi).map((x, i) => [x, pricesXhAhead[i]])
    );

    console.log("regression rsi", result.string, "r2", result.r2);
  }
};
