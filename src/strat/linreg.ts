import { times, round2 } from "./utils";
import { Series } from "pandas-js";
import * as regression from "regression";
import { Candle } from "./types";

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

  const result = regression.linear(indArr.map((x, i) => [x, pctChange[i]]));
  console.log(`REG ${name} ${result.string} | r2   =  ${result.r2}`);

  const corr = round2(new Series(indArr).corr(new Series(pctChange)));
  console.log("\t\t\t CORR", corr);

  const x = indArr;
  const y = pctChange;
  const regEquation = result.equation;

  return { x, y, regEquation, r2: result.r2, corr, name };
};
