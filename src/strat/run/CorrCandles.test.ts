import { Coins } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";
import * as features from "../features";
import * as daterange from "../daterange";
import { BatchConfig } from "../corr/BatchConfig";
import { start } from "../corr/testUtils";
import { CorrCandles } from "../corr/CorrCandles";

const ranges = [daterange.Dec];
const featuresSplit = features.getSMA();

describe("corrCandles | getCandleEndsAt | 60", () => {
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

describe("corrCandles | getCandleEndsAt | 10", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const batchConfig = new BatchConfig(10, 1440);
    month = queryCorrCandlesMonthsBatched(batchConfig, Coins.BTC, ranges, featuresSplit, { skipLog: true }).Dec;
  });

  test("10", () => {
    const c1 = month.getCandleEndsAt(new Date("2018-12-02T00:00:00.000Z"), "x10");
    expect(start(c1)).toEqual("2018-12-01T23:50:00.000Z");
  });

  test("30", () => {
    const c1 = month.getCandleEndsAt(new Date("2018-12-02T00:00:00.000Z"), "x30");
    expect(start(c1)).toEqual("2018-12-01T23:30:00.000Z");
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
});

describe("corrCandles | getCandleEndsAt | 480", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const batchConfig = new BatchConfig(480, 1440);
    month = queryCorrCandlesMonthsBatched(batchConfig, Coins.BTC, ranges, featuresSplit, { skipLog: true }).Dec;
  });

  test("480", () => {
    const c1 = month.getCandleEndsAt(new Date("2018-12-02T00:00:00.000Z"), "x480");
    expect(start(c1)).toEqual("2018-12-01T16:00:00.000Z");
  });

  test("1440", () => {
    const c1 = month.getCandleEndsAt(new Date("2018-12-02T00:00:00.000Z"), "x1440");
    expect(start(c1)).toEqual("2018-12-01T00:00:00.000Z");
  });
});

describe("corrCandles | getPrev | 480", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const batchConfig = new BatchConfig(480, 1440);
    month = queryCorrCandlesMonthsBatched(batchConfig, Coins.BTC, ranges, featuresSplit, { skipLog: true }).Dec;
  });

  test("1", () => {
    const c1 = month.getPrev(0, 1);
    expect(start(c1)).toEqual("2018-11-30T16:00:00.000Z");
  });

  test("3", () => {
    const c1 = month.getPrev(0, 3);
    expect(start(c1)).toEqual("2018-11-30T00:00:00.000Z");
  });

  test("9", () => {
    const c1 = month.getPrev(0, 9);
    expect(start(c1)).toEqual("2018-11-28T00:00:00.000Z");
  });

  test("9-9", () => {
    const c1 = month.getPrev(9, 9);
    expect(start(c1)).toEqual("2018-12-01T00:00:00.000Z");
  });

  test("18-9", () => {
    const c1 = month.getPrev(18, 9);
    expect(start(c1)).toEqual("2018-12-04T00:00:00.000Z");
  });
});

describe("corrCandles | getPrev | 60", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const batchConfig = new BatchConfig(60, 1440);
    month = queryCorrCandlesMonthsBatched(batchConfig, Coins.BTC, ranges, featuresSplit, { skipLog: true }).Dec;
  });

  test("1", () => {
    const c1 = month.getPrev(0, 1);
    expect(start(c1)).toEqual("2018-11-30T23:00:00.000Z");
  });

  test("12", () => {
    const c1 = month.getPrev(0, 12);
    expect(start(c1)).toEqual("2018-11-30T12:00:00.000Z");
  });

  test("24", () => {
    const c1 = month.getPrev(0, 24);
    expect(start(c1)).toEqual("2018-11-30T00:00:00.000Z");
  });
});

describe("corrCandles | getPrevHrs | 60", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const batchConfig = new BatchConfig(60, 1440);
    month = queryCorrCandlesMonthsBatched(batchConfig, Coins.BTC, ranges, featuresSplit, { skipLog: true }).Dec;
  });

  test("1", () => {
    const c1 = month.getPrevHrs(0, 1);
    expect(start(c1)).toEqual("2018-11-30T23:00:00.000Z");
  });

  test("12", () => {
    const c1 = month.getPrevHrs(0, 12);
    expect(start(c1)).toEqual("2018-11-30T12:00:00.000Z");
  });

  test("24", () => {
    const c1 = month.getPrevHrs(0, 24);
    expect(start(c1)).toEqual("2018-11-30T00:00:00.000Z");
  });
});

describe("corrCandles | getPrevHrs | 120", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const batchConfig = new BatchConfig(120, 1440);
    month = queryCorrCandlesMonthsBatched(batchConfig, Coins.BTC, ranges, featuresSplit, { skipLog: true }).Dec;
  });

  test("1", () => {
    expect(() => {
      month.getPrevHrs(0, 1);
    }).toThrowError("getPrevHrs: not integer (minus 1 | div 0.5)");
  });

  test("2", () => {
    const c1 = month.getPrevHrs(0, 2);
    expect(start(c1)).toEqual("2018-11-30T22:00:00.000Z");
  });

  test("24", () => {
    const c1 = month.getPrevHrs(0, 24);
    expect(start(c1)).toEqual("2018-11-30T00:00:00.000Z");
  });
});

describe("corrCandles | getPrevHrs | 1440", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const batchConfig = new BatchConfig(1440, 1440);
    month = queryCorrCandlesMonthsBatched(batchConfig, Coins.BTC, ranges, featuresSplit, { skipLog: true }).Dec;
  });

  test("1", () => {
    expect(() => {
      month.getPrevHrs(0, 1);
    }).toThrowError("getPrevHrs: not integer (minus 1 | div 0.04)");
  });

  test("24", () => {
    const c1 = month.getPrevHrs(0, 24);
    expect(start(c1)).toEqual("2018-11-30T00:00:00.000Z");
  });

  test("48", () => {
    const c1 = month.getPrevHrs(0, 48);
    expect(start(c1)).toEqual("2018-11-29T00:00:00.000Z");
  });
});
