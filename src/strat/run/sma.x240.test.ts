import { Coins, Candle } from "../types";
import { queryCandlesBatched, calcIndicators } from "./queryCorrCandlesMonths";
import * as features from "../features";
import * as daterange from "../daterange";
import { CorrCandles } from "../corr/CorrCandles";
import { BatchConfig } from "../corr/BatchConfig";
import { toUnix, logCandleStart } from "../corr/testUtils";

const ranges = [daterange.Dec];
const featuresSplit = features.getSMA();
const batchConfig = new BatchConfig(60, 1440);

const getSMA = (candle: Candle) => {
  return Math.floor(candle.ind.sma.x240.p10);
};

describe("run", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const candleMonths = queryCandlesBatched(batchConfig, Coins.BTC, ranges);
    const months = calcIndicators(batchConfig, candleMonths, ranges, featuresSplit);
    month = months.Dec;
  });

  // test("candlesActual.length", () => {
  //   const candlesPerDay = 24 / 4;
  //   expect(month.candlesActual.length).toEqual(candlesPerDay * 31);
  // });

  // test("candlesActual.start", () => {
  //   const d = new Date(month.candlesActual[0].start * 1000);
  //   expect(d.toISOString()).toEqual("2018-12-01T00:00:00.000Z");
  // });

  // test("candlesActual.end", () => {
  //   const d = new Date(month.candlesActual[month.candlesActual.length - 1].start * 1000);
  //   expect(d.toISOString()).toEqual("2018-12-31T20:00:00.000Z"); // start + 4h
  // });

  test("candlesActual.lengt", () => {
    expect(month.candlesActual.length).toEqual(24 * 31);
  });

  test("log_candles", () => {
    for (let i = 1; i < month.candles.length; i++) {
      // console.log(new Date(x.start * 1000));
      const curr = month.candles[i];
      // const prev = month.candles[i - 1];
      // expect(curr.start - prev.start).toEqual(60 * 60); // 1h
      console.log(new Date(curr.start * 1000).toISOString(), curr.close);
    }
  });

  test("log_candles", () => {
    for (let i = 1; i < month.candles.length; i++) {
      // console.log(new Date(x.start * 1000));
      const curr = month.candles[i];
      const prev = month.candles[i - 1];
      expect(curr.start - prev.start).toEqual(60 * 60); // 1h
    }
  });

  test("log_candles", () => {
    for (let i = 1; i < month.candlesActual.length; i++) {
      // console.log(new Date(x.start * 1000));
      const curr = month.candlesActual[i];
      const prev = month.candlesActual[i - 1];
      expect(curr.start - prev.start).toEqual(60 * 60); // 1h
    }
  });

  test("1", () => {
    const d1 = toUnix("2018-12-01T00:00:00Z");
    const c1 = month.candlesActual.find(x => x.start === d1);

    {
      const cStart = month.candles[0];
      const cEnd = month.candles[month.candles.length - 1];
      logCandleStart(cStart);
      logCandleStart(cEnd);
    }

    {
      const cStart = month.candlesActual[0];
      const cEnd = month.candlesActual[month.candlesActual.length - 1];
      logCandleStart(cStart);
      logCandleStart(cEnd);
    }

    expect(getSMA(c1)).toEqual(4148);
  });

  test.only("1", () => {
    const d1 = toUnix("2018-12-01T01:00:00Z");
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(getSMA(c1)).toEqual(4148);
  });

  test("1", () => {
    const d1 = toUnix("2018-12-01T04:00:00Z");
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(getSMA(c1)).toEqual(4148);
  });

  test.only("try_find", () => {
    const c1 = month.candlesActual.find(x => Math.floor(x.ind.sma.x240.p10) === 4148);
    logCandleStart(c1);
  });

  test("1", () => {
    const d1 = toUnix("2018-12-05T00:00:00Z");
    const c1 = month.candlesActual.find(x => x.start === d1);
    expect(getSMA(c1)).toEqual(3935);
  });

  test("try_find", () => {
    const c1 = month.candlesActual.find(x => Math.floor(x.ind.sma.x240.p10) === 3935);
    logCandleStart(c1);
  });

  // test("1", () => {
  //   const d1 = Math.floor(new Date("2018-12-07T00:00:00Z").getTime() / 1000);
  //   const c1 = month.candlesActual.find(x => x.start === d1);
  //   expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(27);
  // });

  // test("1", () => {
  //   const d1 = Math.floor(new Date("2018-12-07T04:00:00Z").getTime() / 1000);
  //   const c1 = month.candlesActual.find(x => x.start === d1);
  //   expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(29);
  // });

  // test("1", () => {
  //   const d1 = Math.floor(new Date("2018-12-07T12:00:00Z").getTime() / 1000);
  //   const c1 = month.candlesActual.find(x => x.start === d1);
  //   expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(27);
  // });

  // test("1", () => {
  //   const d1 = Math.floor(new Date("2018-12-07T16:00:00Z").getTime() / 1000);
  //   const c1 = month.candlesActual.find(x => x.start === d1);
  //   expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(37);
  // });

  // test("1", () => {
  //   const d1 = Math.floor(new Date("2018-12-09T08:00:00Z").getTime() / 1000);
  //   const c1 = month.candlesActual.find(x => x.start === d1);
  //   expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(39);
  // });

  // test("1", () => {
  //   const d1 = Math.floor(new Date("2018-12-17T08:00:00Z").getTime() / 1000);
  //   const c1 = month.candlesActual.find(x => x.start === d1);
  //   expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(44);
  //   // expect(c1.ind.rsi.x240.p20).toBeLessThan(48);
  // });

  // test("1", () => {
  //   const d1 = Math.floor(new Date("2018-12-17T12:00:00Z").getTime() / 1000);
  //   const c1 = month.candlesActual.find(x => x.start === d1);
  //   expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(57);
  // });

  // test("1", () => {
  //   const d1 = Math.floor(new Date("2018-12-17T16:00:00Z").getTime() / 1000);
  //   const c1 = month.candlesActual.find(x => x.start === d1);
  //   expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(63);
  // });

  // test("1", () => {
  //   const d1 = Math.floor(new Date("2018-12-17T20:00:00Z").getTime() / 1000);
  //   const c1 = month.candlesActual.find(x => x.start === d1);
  //   expect(Math.floor(c1.ind.rsi.x240.p20)).toEqual(61);
  // });

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
