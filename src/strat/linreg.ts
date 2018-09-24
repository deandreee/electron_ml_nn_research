import { times, round2 } from "./utils";
import { Series } from "pandas-js";
import * as regression from "regression";
import { Candle } from "./types";
import { rescaleArrPlusMinus1 } from "./rescale";

// const { spearson } = require("../../../gekko-develop/strategies/utils");

type fnGetInd = (candle: Candle) => number;

export const linreg = (
  candlesActual: Candle[],
  fnGetInd: fnGetInd,
  pctChange: number[],
  name: string
) => {
  const indArr = candlesActual.map(fnGetInd);

  if (indArr.length !== pctChange.length) {
    throw new Error(
      `linreg length not equal => ${name} | ${indArr.length} vs ${
        pctChange.length
      }`
    );
  }

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

  const s1 = new Series(indArr);
  const s2 = new Series(pctChange);
  const corr = round2(s1.corr(s2));

  // const corrPearson = spearson.correlation.pearson(indArr, pctChange);
  // const corrSpearman = spearson.correlation.spearman(indArr, pctChange);

  console.log(`\t corr ${corr}`);
  console.log("\t -----------------------------------");

  const regEquation = result.equation;

  return { x: xScaled, y: yScaled, regEquation, r2: result.r2, corr, name };
};
