import * as waveUtils from "../waveUtils";
import { createCandle } from "../testUtils";
import { batchCandlesInXs } from "../../db/batchCandlesInXs";

describe("waveUtils | updateCandles", () => {
  const candles = [
    createCandle({ close: 0, start: 0, open: 0, high: 11, low: 11 }),
    createCandle({ close: 1, start: 1, open: 1, high: 12, low: 12 }),
    createCandle({ close: 2, start: 2, open: 2, high: 13, low: 13 }),
    createCandle({ close: 3, start: 3, open: 3, high: 14, low: 14 }),
    createCandle({ close: 4, start: 4, open: 4, high: 15, low: 15 }),
    createCandle({ close: 5, start: 5, open: 5, high: 16, low: 16 }),
    createCandle({ close: 6, start: 6, open: 6, high: 17, low: 17 }),
    createCandle({ close: 7, start: 7, open: 7, high: 18, low: 18 }),
    createCandle({ close: 8, start: 8, open: 8, high: 19, low: 19 }),
    createCandle({ close: 9, start: 9, open: 9, high: 20, low: 20 })
  ];

  test("x1", () => {
    const waveManagers = waveUtils.createManagers(60);

    let bigCandles = null;
    bigCandles = waveUtils.updateCandles(waveManagers, candles[0]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[1]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[2]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[3]);

    // but yeah this is actually right ...
    // because they do start at diff times
    expect(bigCandles.x60.start).toEqual(3);
    expect(bigCandles.x120.start).toEqual(2);
    expect(bigCandles.x240.start).toEqual(0);
  });

  test("x2", () => {
    const waveManagers = waveUtils.createManagers(60);

    let bigCandles = null;
    bigCandles = waveUtils.updateCandles(waveManagers, candles[0]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[1]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[2]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[3]);

    bigCandles = waveUtils.updateCandles(waveManagers, candles[4]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[5]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[6]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[7]);

    // but yeah this is actually right ...
    // because they do start at diff times
    expect(bigCandles.x60.start).toEqual(7);
    expect(bigCandles.x120.start).toEqual(6);
    expect(bigCandles.x240.start).toEqual(4);
  });

  test("x1 diff batchSize", () => {
    const waveManagers1 = waveUtils.createManagers(60);
    const waveManagers2 = waveUtils.createManagers(240);

    let bigCandles1 = null;
    bigCandles1 = waveUtils.updateCandles(waveManagers1, candles[0]);
    bigCandles1 = waveUtils.updateCandles(waveManagers1, candles[1]);
    bigCandles1 = waveUtils.updateCandles(waveManagers1, candles[2]);
    bigCandles1 = waveUtils.updateCandles(waveManagers1, candles[3]);

    let bigCandles2 = null;
    const batchedCandles = batchCandlesInXs(candles, 4);
    bigCandles2 = waveUtils.updateCandles(waveManagers2, batchedCandles[0]);

    expect(bigCandles1.x240.start).toEqual(0);
    expect(bigCandles2.x240.start).toEqual(0);
  });
});
