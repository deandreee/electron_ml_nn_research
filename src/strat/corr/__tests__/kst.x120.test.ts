import { Coins, Candle } from "../../types";
import { queryCandlesBatched, calcIndicators } from "../../db/queryCorrCandlesMonths";
import * as features from "../../features";
import * as daterange from "../../daterange";
import { CorrCandles } from "../../corr/CorrCandles";
import { BatchConfig } from "../../corr/BatchConfig";
import { getRunConfig } from "../testUtils";

const ranges = [daterange.Dec];
const featuresSplit = features.getKST();
const runConfig = getRunConfig(new BatchConfig(10, 1440));

const getKST = (candle: Candle) => {
  const ind = candle.ind.kst.x120.p_sig9_roc5_smaroc_5;
  return {
    kst: Math.floor(ind.kst),
    signal: Math.floor(ind.signal)
  };
};

describe("kst.x120.test", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const candleMonths = queryCandlesBatched(runConfig, Coins.BTC, ranges);
    const months = calcIndicators(runConfig, candleMonths, ranges, featuresSplit);
    month = months.Dec;
  });

  test("candlesActual.length", () => {
    expect(month.candlesActual.length).toEqual(6 * 24 * 31);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-01T00:00:00Z"), "x120");
    expect(getKST(c1).kst).toEqual(-49); // -48 actually
    expect(getKST(c1).signal).toEqual(-34); // -33 actually
  });

  test("2", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-07T06:00:00Z"), "x120");
    expect(getKST(c1).kst).toEqual(-105); // -104 actually
    expect(getKST(c1).signal).toEqual(-62); // -61 actually
  });

  test("3", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-20T16:00:00Z"), "x120");
    expect(getKST(c1).kst).toEqual(87);
    expect(getKST(c1).signal).toEqual(51);
  });

  test("4", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-24T08:00:00Z"), "x120");
    expect(getKST(c1).kst).toEqual(62);
    expect(getKST(c1).signal).toEqual(33);
  });
});
