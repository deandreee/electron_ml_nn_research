import { round2 } from "./utils";
import { Series } from "pandas-js";
import * as regression from "regression";
import { Candle, PctChange } from "./types";
import { rescaleArrPlusMinus1 } from "./rescale";

type fnGetInd = (candle: Candle) => number;

export const linregFX = (
  coinName: string,
  candlesActual: Candle[],
  fnGetInd: fnGetInd,
  pctChange: PctChange,
  name: string
) => {
  return {
    _60m: linreg(coinName, candlesActual, fnGetInd, pctChange._60m, `${name} vs 60m`),
    _120m: linreg(coinName, candlesActual, fnGetInd, pctChange._120m, `${name} vs 120m`),
    _240m: linreg(coinName, candlesActual, fnGetInd, pctChange._240m, `${name} vs 240m`),
    _480m: linreg(coinName, candlesActual, fnGetInd, pctChange._480m, `${name} vs 480m`),
    _1d: linreg(coinName, candlesActual, fnGetInd, pctChange._1d, `${name} vs 1d`),
    _2d: linreg(coinName, candlesActual, fnGetInd, pctChange._2d, `${name} vs 2d`),
    _7d: linreg(coinName, candlesActual, fnGetInd, pctChange._2d, `${name} vs 7d`)
  };
};

export const linreg = (
  coinName: string,
  candlesActual: Candle[],
  fnGetInd: fnGetInd,
  pctChange: number[],
  name: string
) => {
  const indArr = candlesActual.map(fnGetInd);

  if (indArr.length !== pctChange.length) {
    throw new Error(`linreg length not equal => ${name} | ${indArr.length} vs ${pctChange.length}`);
  }

  const x = indArr;
  const y = pctChange;

  const xScaled = rescaleArrPlusMinus1(x);
  const yScaled = rescaleArrPlusMinus1(y);

  const result = regression.linear(xScaled.map((w, i) => [xScaled[i], yScaled[i]]));

  // console.log(`${name}`);
  // console.log(`\t ${result.string}`);
  // console.log(`\t r2: ${result.r2}`);

  const s1 = new Series(xScaled);
  const s2 = new Series(yScaled);
  const corr = round2(s1.corr(s2));

  console.log(`${coinName} \t\t ${name} \t\t ${corr}`);
  // console.log("\t -----------------------------------");

  const regEquation = result.equation;

  return { x: xScaled, y: yScaled, regEquation, r2: result.r2, corr, name };
};
