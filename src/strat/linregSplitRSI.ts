import { times, round2, avg } from "./utils";
import { Series } from "pandas-js";
import * as regression from "regression";
import { Candle } from "./types";
import { WSAEINPROGRESS, WSAEADDRINUSE } from "constants";

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

  const result = regression.linear(indArrSplit);
  console.log(
    `REG ${name} ${result.string} | r2   =  ${result.r2} | avgPct = ${avgPct}`
  );

  const s1 = new Series(indArrSplit.map(x => x[0]));
  const s2 = new Series(indArrSplit.map(x => x[1]));
  console.log("\t\t\t CORR", round2(s1.corr(s2)));

  const x = indArr;
  const y = pctChange;
  const regEquation = result.equation;

  return { x, y, regEquation };
};
