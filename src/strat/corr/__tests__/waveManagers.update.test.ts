import * as waveUtils from "../waveUtils";
import { createCandle } from "../testUtils";

describe("waveManagers.update", () => {
  const candles = [
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

  test("wave init idx 0", () => {
    const waveManagers = waveUtils.createManagers(60);
    expect(waveManagers.x120.getCurrentWaveIdx()).toEqual(0);
  });

  test("wave update idx 1", () => {
    const waveManagers = waveUtils.createManagers(60);
    waveManagers.x120.update(candles[0]);
    expect(waveManagers.x120.getCurrentWaveIdx()).toEqual(1);
  });

  test("wave update x2 idx 0", () => {
    const waveManagers = waveUtils.createManagers(60);
    waveManagers.x120.update(candles[0]);
    waveManagers.x120.update(candles[1]);
    expect(waveManagers.x120.getCurrentWaveIdx()).toEqual(0);
  });

  test("update x1", () => {
    const waveManagers = waveUtils.createManagers(60);

    const bigCandle = waveManagers.x120.update(candles[0]);

    expect(bigCandle).toBeNull();
  });

  test("update x2", () => {
    const waveManagers = waveUtils.createManagers(60);

    waveManagers.x120.update(candles[0]);
    const bigCandle = waveManagers.x120.update(candles[1]);

    expect(bigCandle).not.toBeNull();
    expect(bigCandle.close).toEqual(2);
  });

  test("update x3", () => {
    const waveManagers = waveUtils.createManagers(60);

    waveManagers.x120.update(candles[0]);
    waveManagers.x120.update(candles[1]);
    const bigCandle = waveManagers.x120.update(candles[2]);

    expect(bigCandle).not.toBeNull();
    expect(bigCandle.close).toEqual(3);
  });

  test("update x4", () => {
    const waveManagers = waveUtils.createManagers(60);

    waveManagers.x120.update(candles[0]);
    waveManagers.x120.update(candles[1]);
    waveManagers.x120.update(candles[2]);
    const bigCandle = waveManagers.x120.update(candles[3]);

    expect(bigCandle).not.toBeNull();
    expect(bigCandle.close).toEqual(4);
  });

  test("update x5", () => {
    const waveManagers = waveUtils.createManagers(60);

    waveManagers.x120.update(candles[0]);
    waveManagers.x120.update(candles[1]);
    waveManagers.x120.update(candles[2]);
    waveManagers.x120.update(candles[3]);
    const bigCandle = waveManagers.x120.update(candles[4]);

    expect(bigCandle).not.toBeNull();
    expect(bigCandle.close).toEqual(5);
  });

  test("update x6", () => {
    const waveManagers = waveUtils.createManagers(60);

    waveManagers.x120.update(candles[0]);
    waveManagers.x120.update(candles[1]);
    waveManagers.x120.update(candles[2]);
    waveManagers.x120.update(candles[3]);
    waveManagers.x120.update(candles[4]);
    const bigCandle = waveManagers.x120.update(candles[5]);

    expect(bigCandle).not.toBeNull();
    expect(bigCandle.close).toEqual(6);
  });
});
