import { Coins } from "../types";
import { queryCandlesBatched, calcIndicators } from "./queryCorrCandlesMonths";
import * as features from "../features";
import * as daterange from "../daterange";
import { CorrCandles } from "../corr/CorrCandles";
import { BatchConfig } from "../corr/BatchConfig";

const ranges = [daterange.Dec];
const featuresSplit = features.getRSI();
const batchConfig = new BatchConfig(60, 1440);

describe("run", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const candleMonths = queryCandlesBatched(batchConfig, Coins.BTC, ranges);
    const months = calcIndicators(batchConfig, candleMonths, ranges, featuresSplit);
    month = months.Dec;
  });

  test("candlesActual.length", () => {
    const candlesPerDay = 24 / 4;
    expect(month.candlesActual.length).toEqual(candlesPerDay * 31);
  });

  test("candlesActual.start", () => {
    const d = new Date(month.candlesActual[0].start * 1000);
    expect(d.toISOString()).toEqual("2018-12-01T00:00:00.000Z");
  });

  test("candlesActual.end", () => {
    const d = new Date(month.candlesActual[month.candlesActual.length - 1].start * 1000);
    expect(d.toISOString()).toEqual("2018-12-31T20:00:00.000Z"); // start + 4h
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-01T00:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(44);
  });

  test.only("try_find", () => {
    const c1 = month.candlesActual.find(x => Math.floor(x.ind.rsi.x240.p20) === 27);
    console.log(new Date(c1.start * 1000));
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-07T00:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(27);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-07T04:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(29);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-07T12:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(27);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-07T16:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(37);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-09T08:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(39);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-17T08:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(44);
    // expect(c1.ind.rsi.x240.p20).toBeLessThan(48);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-17T12:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(57);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-17T16:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(63);
  });

  test("1", () => {
    const d1 = Math.floor(new Date("2018-12-17T20:00:00Z").getTime() / 1000);
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(61);
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
