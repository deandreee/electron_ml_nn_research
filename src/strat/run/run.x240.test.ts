import { Coins } from "../types";
import { queryCandlesBatched, calcIndicators } from "./queryCorrCandlesMonths";
import * as features from "../features";
import * as daterange from "../daterange";
import { CorrCandles } from "../corr/CorrCandles";

const ranges = [daterange.Dec];
const featuresSplit = features.getRSI();

describe("run", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const candleMonths = queryCandlesBatched(Coins.BTC, ranges);
    const months = calcIndicators(candleMonths, ranges, featuresSplit);
    month = months.Dec;
  });

  test("1", () => {
    expect(month.candlesActual.length).toBeGreaterThan(700);
  });

  test("candlesActual.start", () => {
    const d = new Date(month.candlesActual[0].start * 1000);
    expect(d.toISOString()).toEqual("2018-12-01T00:00:00.000Z");
  });

  test("candlesActual.end", () => {
    const d = new Date(month.candlesActual[month.candlesActual.length - 1].start * 1000);
    expect(d.toISOString()).toEqual("2019-01-01T00:00:00.000Z");
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-07T00:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x240.p20).toBeGreaterThan(27);
    expect(c1.ind.rsi.x240.p20).toBeLessThan(28);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-07T04:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x240.p20).toBeGreaterThan(29);
    expect(c1.ind.rsi.x240.p20).toBeLessThan(30);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-07T12:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x240.p20).toBeGreaterThan(23);
    expect(c1.ind.rsi.x240.p20).toBeLessThan(24);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-07T16:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x240.p20).toBeGreaterThan(36);
    expect(c1.ind.rsi.x240.p20).toBeLessThan(37);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-09T08:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x240.p20).toBeGreaterThan(39);
    expect(c1.ind.rsi.x240.p20).toBeLessThan(40);
  });

  test.only("1", () => {
    const d1 = Math.floor(new Date("2018-12-17T08:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x240.p20).toBeGreaterThan(47);
    expect(c1.ind.rsi.x240.p20).toBeLessThan(48);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-17T12:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x240.p20).toBeGreaterThan(63);
    expect(c1.ind.rsi.x240.p20).toBeLessThan(64);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-17T16:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x240.p20).toBeGreaterThan(70);
    expect(c1.ind.rsi.x240.p20).toBeLessThan(71);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-17T20:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(c1.ind.rsi.x240.p20).toBeGreaterThan(67);
    expect(c1.ind.rsi.x240.p20).toBeLessThan(68);
  });

  // {
  //   const d1 = Math.floor(new Date("2018-12-09T14:00:00Z").getTime() / 1000);
  //   const c1 = month.candlesActual.find(x => x.start === d1);
  //   expect(c1.ind.rsi.x240.p20).toBeGreaterThan(68);
  //   expect(c1.ind.rsi.x240.p20).toBeLessThan(69);
  // }

  // {
  //   const d1 = Math.floor(new Date("2018-12-09T16:00:00Z").getTime() / 1000);
  //   const c1 = month.candlesActual.find(x => x.start === d1);
  //   expect(c1.ind.rsi.x240.p20).toBeGreaterThan(76);
  //   expect(c1.ind.rsi.x240.p20).toBeLessThan(77);
  // }

  // {
  //   const d1 = Math.floor(new Date("2018-12-10T15:00:00Z").getTime() / 1000);
  //   const c1 = month.candlesActual.find(x => x.start === d1);
  //   expect(c1.ind.rsi.x240.p20).toBeGreaterThan(30);
  //   expect(c1.ind.rsi.x240.p20).toBeLessThan(31);
  // }

  // {
  //   const d1 = Math.floor(new Date("2018-12-17T12:00:00Z").getTime() / 1000);
  //   const c1 = month.candlesActual.find(x => x.start === d1);
  //   expect(c1.ind.rsi.x240.p20).toBeGreaterThan(87);
  //   expect(c1.ind.rsi.x240.p20).toBeLessThan(88);
  // }

  // {
  //   const d1 = Math.floor(new Date("2018-12-17T13:00:00Z").getTime() / 1000);
  //   const c1 = month.candlesActual.find(x => x.start === d1);
  //   expect(c1.ind.rsi.x240.p20).toBeGreaterThan(85);
  //   expect(c1.ind.rsi.x240.p20).toBeLessThan(86);
  // }

  // {
  //   const d1 = Math.floor(new Date("2018-12-17T20:00:00Z").getTime() / 1000);
  //   const c1 = month.candlesActual.find(x => x.start === d1);
  //   expect(c1.ind.rsi.x240.p20).toBeGreaterThan(92);
  //   expect(c1.ind.rsi.x240.p20).toBeLessThan(93);
  // }

  // {
  //   const d1 = Math.floor(new Date("2018-12-17T21:00:00Z").getTime() / 1000);
  //   const c1 = month.candlesActual.find(x => x.start === d1);
  //   expect(c1.ind.rsi.x240.p20).toBeGreaterThan(70);
  //   expect(c1.ind.rsi.x240.p20).toBeLessThan(71);
  // }
});
