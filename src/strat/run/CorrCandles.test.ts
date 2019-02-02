import { Coins } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";
import * as features from "../features";
import * as daterange from "../daterange";
import { BatchConfig } from "../corr/BatchConfig";
import { start } from "../corr/testUtils";
import { CorrCandles } from "../corr/CorrCandles";

const ranges = [daterange.Dec];
const featuresSplit = features.getSMA();

describe("corrCandles | 60", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const batchConfig = new BatchConfig(60, 1440);
    month = queryCorrCandlesMonthsBatched(batchConfig, Coins.BTC, ranges, featuresSplit, { skipLog: true }).Dec;
  });

  test("60", () => {
    const c1 = month.getCandleEndsAt(new Date("2018-12-02T00:00:00.000Z"), "x60");
    expect(start(c1)).toEqual("2018-12-01T23:00:00.000Z");
  });

  test("120", () => {
    const c1 = month.getCandleEndsAt(new Date("2018-12-02T00:00:00.000Z"), "x120");
    expect(start(c1)).toEqual("2018-12-01T22:00:00.000Z");
  });

  test("240", () => {
    const c1 = month.getCandleEndsAt(new Date("2018-12-02T00:00:00.000Z"), "x240");
    expect(start(c1)).toEqual("2018-12-01T20:00:00.000Z");
  });

  test("480", () => {
    const c1 = month.getCandleEndsAt(new Date("2018-12-02T00:00:00.000Z"), "x480");
    expect(start(c1)).toEqual("2018-12-01T16:00:00.000Z");
  });

  test("1440", () => {
    const c1 = month.getCandleEndsAt(new Date("2018-12-02T00:00:00.000Z"), "x1440");
    expect(start(c1)).toEqual("2018-12-01T00:00:00.000Z");
  });

  test("60 behind", () => {
    const c1 = month.getCandleEndsAt(new Date("2018-12-01T00:00:00.000Z"), "x60");
    expect(start(c1)).toEqual("2018-11-30T23:00:00.000Z");
  });

  test("120 behind", () => {
    const c1 = month.getCandleEndsAt(new Date("2018-12-01T00:00:00.000Z"), "x120");
    expect(start(c1)).toEqual("2018-11-30T22:00:00.000Z");
  });

  test("240 behind", () => {
    const c1 = month.getCandleEndsAt(new Date("2018-12-01T00:00:00.000Z"), "x240");
    expect(start(c1)).toEqual("2018-11-30T20:00:00.000Z");
  });

  test("480 behind", () => {
    const c1 = month.getCandleEndsAt(new Date("2018-12-01T00:00:00.000Z"), "x480");
    expect(start(c1)).toEqual("2018-11-30T16:00:00.000Z");
  });

  test("1440 behind", () => {
    const c1 = month.getCandleEndsAt(new Date("2018-12-01T00:00:00.000Z"), "x1440");
    expect(start(c1)).toEqual("2018-11-30T00:00:00.000Z");
  });

  test("tfWave < tfBatched", () => {
    expect(() => {
      month.getCandleEndsAt(new Date("2018-12-01T00:00:00.000Z"), "x30");
    }).toThrowError("tfWave (30) < tfBatched (60)");
  });
});
