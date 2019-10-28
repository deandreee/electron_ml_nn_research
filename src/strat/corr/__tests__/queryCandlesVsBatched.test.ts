import { Coins, CoinData } from "../../types";
import { queryCandlesBatched, queryCandles } from "../../db/queryCorrCandlesMonths";
import * as daterange from "../../daterange";
import { start, getRunConfig } from "../../corr/testUtils";
import { BatchConfig } from "../../corr/BatchConfig";

const ranges = [daterange.Dec];

describe("queryCandlesVsBatched", () => {
  let monthRaw: CoinData = null;
  let month1: CoinData = null;
  let month2: CoinData = null;

  beforeAll(() => {
    const runConfigRaw = getRunConfig(new BatchConfig(1, 1440));
    monthRaw = queryCandles(runConfigRaw, Coins.BTC, ranges).Dec;

    const runConfig1 = getRunConfig(new BatchConfig(60, 1440));
    month1 = queryCandlesBatched(runConfig1, Coins.BTC, ranges).Dec;

    const runConfig2 = getRunConfig(new BatchConfig(120, 1440));
    month2 = queryCandlesBatched(runConfig2, Coins.BTC, ranges).Dec;
  });

  // test("monthRaw vs month1", () => {
  //   expect(monthRaw.candles.length + 1).toEqual(month1.candles.length * 60);
  // });

  // test("monthRaw vs month2", () => {
  //   expect(monthRaw.candles.length - 1).toEqual(month2.candles.length * 120);
  // });

  // test("month1 vs month2", () => {
  //   expect(month1.candles.length).toEqual(month2.candles.length * 2);
  // });

  test("start 0", () => {
    const c1 = month1.candles[0];
    const c2 = month2.candles[0];
    expect(start(c1)).toEqual(start(c2));
  });

  test("start 2/1", () => {
    const c1 = month1.candles[2];
    const c2 = month2.candles[1];
    expect(start(c1)).toEqual(start(c2));
  });

  test("close 1/0", () => {
    const c1 = month1.candles[1];
    const c2 = month2.candles[0];
    expect(c1.close).toEqual(c2.close);
  });

  test("close 1/0 vs raw", () => {
    const cRaw = monthRaw.candles[119];

    const c1 = month1.candles[1];
    const c2 = month2.candles[0];
    expect(cRaw.close).toEqual(c1.close);
    expect(cRaw.close).toEqual(c2.close);
  });

  test("start 4/2", () => {
    const c1 = month1.candles[4];
    const c2 = month2.candles[2];
    expect(start(c1)).toEqual(start(c2));
  });

  test("close 3/1", () => {
    const c1 = month1.candles[3];
    const c2 = month2.candles[1];
    expect(c1.close).toEqual(c2.close);
  });

  test("close 1/3 vs raw", () => {
    const cRaw = monthRaw.candles[239];

    // console.log(monthRaw.candles.slice(220, 260).map((x, i) => ({ i, start: start(x), close: x.close })));

    const c1 = month1.candles[3];
    const c2 = month2.candles[1];
    expect(cRaw.close).toEqual(c1.close);
    expect(cRaw.close).toEqual(c2.close);
  });
});
