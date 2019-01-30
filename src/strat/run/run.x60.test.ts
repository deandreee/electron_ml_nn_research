import { Coins } from "../types";
import { queryCandlesBatched, calcIndicators } from "./queryCorrCandlesMonths";
import * as features from "../features";
import * as daterange from "../daterange";
import { CorrCandles } from "../corr/CorrCandles";

const ranges = [daterange.Dec];
const featuresSplit = features.getRSI();

describe("x60", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const candleMonths = queryCandlesBatched(Coins.BTC, ranges);
    const months = calcIndicators(candleMonths, ranges, featuresSplit);
    month = months.Dec;
  });

  test("length", () => {
    expect(month.candlesActual.length).toBeGreaterThan(700);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-07T00:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x60.p10).toBeGreaterThan(13);
    expect(c1.ind.rsi.x60.p10).toBeLessThan(14);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-07T01:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x60.p10).toBeGreaterThan(19);
    expect(c1.ind.rsi.x60.p10).toBeLessThan(20);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-07T02:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x60.p10).toBeGreaterThan(18);
    expect(c1.ind.rsi.x60.p10).toBeLessThan(19);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-07T05:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x60.p10).toBeGreaterThan(32);
    expect(c1.ind.rsi.x60.p10).toBeLessThan(33);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-07T19:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x60.p10).toBeGreaterThan(59);
    expect(c1.ind.rsi.x60.p10).toBeLessThan(60);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-09T14:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x60.p10).toBeGreaterThan(68);
    expect(c1.ind.rsi.x60.p10).toBeLessThan(69);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-09T16:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x60.p10).toBeGreaterThan(76);
    expect(c1.ind.rsi.x60.p10).toBeLessThan(77);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-10T15:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x60.p10).toBeGreaterThan(30);
    expect(c1.ind.rsi.x60.p10).toBeLessThan(31);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-17T12:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x60.p10).toBeGreaterThan(87);
    expect(c1.ind.rsi.x60.p10).toBeLessThan(88);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-17T13:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x60.p10).toBeGreaterThan(85);
    expect(c1.ind.rsi.x60.p10).toBeLessThan(86);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-17T20:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x60.p10).toBeGreaterThan(92);
    expect(c1.ind.rsi.x60.p10).toBeLessThan(93);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-17T21:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x60.p10).toBeGreaterThan(70);
    expect(c1.ind.rsi.x60.p10).toBeLessThan(71);
  });
});
