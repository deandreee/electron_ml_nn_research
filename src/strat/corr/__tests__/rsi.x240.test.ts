import { Coins } from "../../types";
import { queryCandlesBatched, calcIndicators } from "../../run/queryCorrCandlesMonths";
import * as features from "../../features";
import * as daterange from "../../daterange";
import { CorrCandles } from "../../corr/CorrCandles";
import { BatchConfig } from "../../corr/BatchConfig";

const ranges = [daterange.Dec];
const featuresSplit = features.getRSI();
const batchConfig = new BatchConfig(60, 1440);

describe("rsi | x240 | p20", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const candleMonths = queryCandlesBatched(batchConfig, Coins.BTC, ranges);
    const months = calcIndicators(batchConfig, candleMonths, ranges, featuresSplit);
    month = months.Dec;
  });

  test("candlesActual.length", () => {
    const candlesPerDay = 24;
    expect(month.candlesActual.length).toEqual(candlesPerDay * 31);
  });

  test("candlesActual.start", () => {
    const d = new Date(month.candlesActual[0].start * 1000);
    expect(d.toISOString()).toEqual("2018-12-01T00:00:00.000Z");
  });

  test("candlesActual.end", () => {
    const d = new Date(month.candlesActual[month.candlesActual.length - 1].start * 1000);
    expect(d.toISOString()).toEqual("2018-12-31T23:00:00.000Z");
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-01T00:00:00Z"), "x240");
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(44);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-07T00:00:00Z"), "x240");
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(27);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-07T04:00:00Z"), "x240");
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(29);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-07T12:00:00Z"), "x240");
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(27);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-07T16:00:00Z"), "x240");
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(37);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-09T08:00:00Z"), "x240");
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(39);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-17T08:00:00Z"), "x240");
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(44);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-17T12:00:00Z"), "x240");
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(57);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-17T16:00:00Z"), "x240");
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(63);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-17T20:00:00Z"), "x240");
    expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(61);
  });
});
