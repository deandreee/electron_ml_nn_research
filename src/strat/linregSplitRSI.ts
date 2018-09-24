import { times, round2, avg } from "./utils";
import { Series } from "pandas-js";
import * as regression from "regression";
import { Candle } from "./types";
import { rescaleArrPlusMinus1 } from "./rescale";

type fnGetInd = (candle: Candle) => number;

export const linregSplitRSI = (
  candlesActual: Candle[],
  fnGetInd: fnGetInd,
  pctChange: number[],
  name: string
) => {
  const indArr = candlesActual.map(fnGetInd);
  const indArrSplit = indArr
    .map((x, i) => (x <= 30 ? [x, pctChange[i]] : null))
    .filter(x => !!x);

  if (indArr.length !== pctChange.length) {
    throw new Error(
      `linreg length not equal => ${name} | ${indArr.length} vs ${
        pctChange.length
      }`
    );
  }

  const avgPct = round2(avg(indArrSplit, x => x[1]));

  const x = indArr;
  const y = pctChange;
  const xScaled = rescaleArrPlusMinus1(x);
  const yScaled = rescaleArrPlusMinus1(y);

  const result = regression.linear(
    xScaled.map((w, i) => [xScaled[i], yScaled[i]])
  );
  console.log(`REG ${name}`);
  console.log(`\t ${result.string}`);
  console.log(`\t r2: ${result.r2}`);

  const s1 = new Series(xScaled);
  const s2 = new Series(yScaled);
  const corr = round2(s1.corr(s2));
  console.log(`\t corr ${corr}`);
  console.log("\t -----------------------------------");

  const regEquation = result.equation;

  return { x, y, regEquation };
};
