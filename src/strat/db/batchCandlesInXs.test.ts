import { Candle } from "../types";
import { batchCandlesInXs } from "./batchCandlesInXs";
import { createCandle } from "../corr/testUtils";

describe("batchCandlesInXs", () => {
  let bigCandles: Candle[] = null;

  beforeAll(() => {
    const first10 = [
      createCandle({ close: 1, start: 1, open: 1, high: 11, low: 11 }),
      createCandle({ close: 2, start: 2, open: 2, high: 12, low: 12 }),
      createCandle({ close: 3, start: 3, open: 3, high: 13, low: 13 }),
      createCandle({ close: 4, start: 4, open: 4, high: 14, low: 14 }),
      createCandle({ close: 5, start: 5, open: 5, high: 15, low: 15 }),
      createCandle({ close: 6, start: 6, open: 6, high: 16, low: 16 }),
      createCandle({ close: 7, start: 7, open: 7, high: 17, low: 17 }),
      createCandle({ close: 8, start: 8, open: 8, high: 18, low: 18 }),
      createCandle({ close: 9, start: 9, open: 9, high: 19, low: 19 }),
      createCandle({ close: 10, start: 10, open: 10, high: 20, low: 20 })
    ];

    bigCandles = batchCandlesInXs(first10, 3);
  });

  // last partial is removed, check comment in batched
  test("candlesActual.length", () => {
    expect(bigCandles.length).toEqual(3);
  });

  test("0", () => {
    expect(bigCandles[0].close).toEqual(3);
    expect(bigCandles[0].start).toEqual(1);
    expect(bigCandles[0].open).toEqual(1);
    expect(bigCandles[0].high).toEqual(13);
    expect(bigCandles[0].low).toEqual(11);
  });

  test("1", () => {
    expect(bigCandles[1].close).toEqual(6);
    expect(bigCandles[1].start).toEqual(4);
    expect(bigCandles[1].open).toEqual(4);
    expect(bigCandles[1].high).toEqual(16);
    expect(bigCandles[1].low).toEqual(14);
  });

  test("2", () => {
    expect(bigCandles[2].close).toEqual(9);
    expect(bigCandles[2].start).toEqual(7);
    expect(bigCandles[2].open).toEqual(7);
    expect(bigCandles[2].high).toEqual(19);
    expect(bigCandles[2].low).toEqual(17);
  });
});
