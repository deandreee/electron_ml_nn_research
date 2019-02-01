import * as waveUtils from "./waveUtils";
import { createCandle } from "./testUtils";

describe("waveUtils", () => {
  const candles = [
    createCandle({ close: 0, start: 1, open: 1, high: 11, low: 11 }),
    createCandle({ close: 1, start: 2, open: 2, high: 12, low: 12 }),
    createCandle({ close: 2, start: 3, open: 3, high: 13, low: 13 }),
    createCandle({ close: 3, start: 4, open: 4, high: 14, low: 14 }),
    createCandle({ close: 4, start: 5, open: 5, high: 15, low: 15 }),
    createCandle({ close: 5, start: 6, open: 6, high: 16, low: 16 }),
    createCandle({ close: 6, start: 7, open: 7, high: 17, low: 17 }),
    createCandle({ close: 7, start: 8, open: 8, high: 18, low: 18 }),
    createCandle({ close: 8, start: 9, open: 9, high: 19, low: 19 }),
    createCandle({ close: 9, start: 10, open: 10, high: 20, low: 20 })
  ];

  test("x1", () => {
    const waveManagers = waveUtils.createManagers(30);

    const bigCandle = waveManagers.x120.update(candles[0]);

    expect(bigCandle).toBeNull();
  });

  test("x2", () => {
    const waveManagers = waveUtils.createManagers(30);

    waveManagers.x120.update(candles[0]);
    const bigCandle = waveManagers.x120.update(candles[1]);

    expect(bigCandle).toBeNull();
  });

  test("x3", () => {
    const waveManagers = waveUtils.createManagers(30);

    waveManagers.x120.update(candles[0]);
    waveManagers.x120.update(candles[1]);
    const bigCandle = waveManagers.x120.update(candles[2]);

    expect(bigCandle).toBeNull();
  });

  test("x4", () => {
    const waveManagers = waveUtils.createManagers(30);

    waveManagers.x120.update(candles[0]);
    waveManagers.x120.update(candles[1]);
    waveManagers.x120.update(candles[2]);
    const bigCandle = waveManagers.x120.update(candles[3]);

    expect(bigCandle).not.toBeNull();
    expect(bigCandle.close).toEqual(3);
  });

  test("x5", () => {
    const waveManagers = waveUtils.createManagers(30);

    waveManagers.x120.update(candles[0]);
    waveManagers.x120.update(candles[1]);
    waveManagers.x120.update(candles[2]);
    waveManagers.x120.update(candles[3]);
    const bigCandle = waveManagers.x120.update(candles[4]);

    expect(bigCandle).not.toBeNull();
    expect(bigCandle.close).toEqual(4);
  });

  test("x6", () => {
    const waveManagers = waveUtils.createManagers(30);

    waveManagers.x120.update(candles[0]);
    waveManagers.x120.update(candles[1]);
    waveManagers.x120.update(candles[2]);
    waveManagers.x120.update(candles[3]);
    waveManagers.x120.update(candles[4]);
    const bigCandle = waveManagers.x120.update(candles[5]);

    expect(bigCandle).not.toBeNull();
    expect(bigCandle.close).toEqual(5);
  });

  test("x7", () => {
    const waveManagers = waveUtils.createManagers(30);

    waveManagers.x120.update(candles[0]);
    waveManagers.x120.update(candles[1]);
    waveManagers.x120.update(candles[2]);
    waveManagers.x120.update(candles[3]);
    waveManagers.x120.update(candles[4]);
    waveManagers.x120.update(candles[5]);
    const bigCandle = waveManagers.x120.update(candles[6]);

    expect(bigCandle).not.toBeNull();
    expect(bigCandle.close).toEqual(6);
  });

  test("x8", () => {
    const waveManagers = waveUtils.createManagers(30);

    waveManagers.x120.update(candles[0]);
    waveManagers.x120.update(candles[1]);
    waveManagers.x120.update(candles[2]);
    waveManagers.x120.update(candles[3]);
    waveManagers.x120.update(candles[4]);
    waveManagers.x120.update(candles[5]);
    waveManagers.x120.update(candles[6]);
    const bigCandle = waveManagers.x120.update(candles[7]);

    expect(bigCandle).not.toBeNull();
    expect(bigCandle.close).toEqual(7);
  });

  test("x9", () => {
    const waveManagers = waveUtils.createManagers(30);

    waveManagers.x120.update(candles[0]);
    waveManagers.x120.update(candles[1]);
    waveManagers.x120.update(candles[2]);
    waveManagers.x120.update(candles[3]);
    waveManagers.x120.update(candles[4]);
    waveManagers.x120.update(candles[5]);
    waveManagers.x120.update(candles[6]);
    waveManagers.x120.update(candles[7]);
    const bigCandle = waveManagers.x120.update(candles[8]);

    expect(bigCandle).not.toBeNull();
    expect(bigCandle.close).toEqual(8);
  });
});
