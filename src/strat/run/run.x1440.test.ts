import { Coins } from "../types";
import { queryCandlesBatched, calcIndicators } from "./queryCorrCandlesMonths";
import * as features from "../features";
import * as daterange from "../daterange";
import { CorrCandles } from "../corr/CorrCandles";
import { BatchConfig } from "../corr/BatchConfig";

const ranges = [daterange.Dec];
const featuresSplit = features.getRSI();
const batchConfig = new BatchConfig(60, 1440);

describe("x1440", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const candleMonths = queryCandlesBatched(batchConfig, Coins.BTC, ranges);
    const months = calcIndicators(batchConfig, candleMonths, ranges, featuresSplit);
    month = months.Dec;
  });

  test("1", () => {
    expect(month.candlesActual.length).toBeGreaterThan(700);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-07T00:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x1440.p15).toBeGreaterThan(23);
    expect(c1.ind.rsi.x1440.p15).toBeLessThan(24);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-15T00:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x1440.p15).toBeGreaterThan(25);
    expect(c1.ind.rsi.x1440.p15).toBeLessThan(26);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-17T00:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x1440.p15).toBeGreaterThan(36);
    expect(c1.ind.rsi.x1440.p15).toBeLessThan(37);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-20T00:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x1440.p15).toBeGreaterThan(52);
    expect(c1.ind.rsi.x1440.p15).toBeLessThan(53);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-25T00:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x1440.p15).toBeGreaterThan(45);
    expect(c1.ind.rsi.x1440.p15).toBeLessThan(46);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-28T00:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x1440.p15).toBeGreaterThan(48);
    expect(c1.ind.rsi.x1440.p15).toBeLessThan(49);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-31T00:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x1440.p15).toBeGreaterThan(45);
    expect(c1.ind.rsi.x1440.p15).toBeLessThan(46);
  });
});
