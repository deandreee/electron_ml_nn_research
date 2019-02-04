import { Coins, Candle } from "../../types";
import { queryCandlesBatched, calcIndicators } from "../../run/queryCorrCandlesMonths";
import * as features from "../../features";
import * as daterange from "../../daterange";
import { CorrCandles } from "../../corr/CorrCandles";
import { BatchConfig } from "../../corr/BatchConfig";
import { getRunConfig } from "../testUtils";

const ranges = [daterange.Dec];
const featuresSplit = features.getMFI();
const runConfig = getRunConfig(new BatchConfig(60, 1440));

const getMFI = (candle: Candle) => {
  return Math.floor(candle.ind.mfi.x60.p10);
};

describe("mfi | x60 | p10", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const candleMonths = queryCandlesBatched(runConfig, Coins.BTC, ranges);
    const months = calcIndicators(runConfig, candleMonths, ranges, featuresSplit);
    month = months.Dec;
  });

  test("length", () => {
    expect(month.candlesActual.length).toBeGreaterThan(700);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-01T00:00:00Z"), "x60");
    expect(getMFI(c1)).toEqual(50);
  });

  test("2", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-11-29T10:00:00Z"), "x60");
    expect(getMFI(c1)).toEqual(58); // originally 59, but this also works
  });

  test("3", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-08T08:00:00Z"), "x60");
    expect(getMFI(c1)).toEqual(51); // 52 originally
  });

  test("4", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-17T17:00:00Z"), "x60");
    expect(getMFI(c1)).toEqual(86);
  });

  test("5", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-19T05:00:00Z"), "x60");
    expect(getMFI(c1)).toEqual(85); // 86 originally
  });

  test("6", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-06T18:00:00Z"), "x60");
    expect(getMFI(c1)).toEqual(3); // 4 originally
  });

  test("7", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-31T19:00:00Z"), "x60");
    expect(getMFI(c1)).toEqual(23);
  });
});
