import { Coins } from "../../types";
import { queryCandlesBatched, calcIndicators } from "../../db/queryCorrCandlesMonths";
import * as features from "../../features";
import * as daterange from "../../daterange";
import { CorrCandles } from "../../corr/CorrCandles";
import { BatchConfig } from "../../corr/BatchConfig";
import { getRunConfig } from "../testUtils";

const ranges = [daterange.Dec];
const featuresSplit = features.getRSI();
const runConfig = getRunConfig(new BatchConfig(60, 1440));

describe("rsi | x1440 | p15", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const candleMonths = queryCandlesBatched(runConfig, Coins.BTC, ranges);
    const months = calcIndicators(runConfig, candleMonths, ranges, featuresSplit);
    month = months.Dec;
  });

  test("1", () => {
    expect(month.candlesActual.length).toBeGreaterThan(700);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-07T00:00:00Z"), "x1440");
    expect(c1.ind.rsi.x1440.p15).toBeGreaterThan(23);
    expect(c1.ind.rsi.x1440.p15).toBeLessThan(24);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-15T00:00:00Z"), "x1440");
    expect(c1.ind.rsi.x1440.p15).toBeGreaterThan(25);
    expect(c1.ind.rsi.x1440.p15).toBeLessThan(26);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-17T00:00:00Z"), "x1440");
    expect(c1.ind.rsi.x1440.p15).toBeGreaterThan(36);
    expect(c1.ind.rsi.x1440.p15).toBeLessThan(37);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-20T00:00:00Z"), "x1440");
    expect(c1.ind.rsi.x1440.p15).toBeGreaterThan(52);
    expect(c1.ind.rsi.x1440.p15).toBeLessThan(53);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-25T00:00:00Z"), "x1440");
    expect(c1.ind.rsi.x1440.p15).toBeGreaterThan(45);
    expect(c1.ind.rsi.x1440.p15).toBeLessThan(46);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-28T00:00:00Z"), "x1440");
    expect(c1.ind.rsi.x1440.p15).toBeGreaterThan(48);
    expect(c1.ind.rsi.x1440.p15).toBeLessThan(49);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-31T00:00:00Z"), "x1440");
    expect(c1.ind.rsi.x1440.p15).toBeGreaterThan(45);
    expect(c1.ind.rsi.x1440.p15).toBeLessThan(46);
  });
});
