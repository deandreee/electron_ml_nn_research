import * as waveUtils from "../waveUtils";
import { createCandle } from "../testUtils";
import { WaveManagers } from "../../indicators/gekko";

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
  createCandle({ close: 9, start: 10, open: 10, high: 20, low: 20 }),
  createCandle({ close: 10, start: 10, open: 10, high: 20, low: 20 }),
  createCandle({ close: 11, start: 10, open: 10, high: 20, low: 20 }),
  createCandle({ close: 12, start: 10, open: 10, high: 20, low: 20 }),
  createCandle({ close: 13, start: 10, open: 10, high: 20, low: 20 })
];

describe("waveUtils | updateCandles | x1 - 1", () => {
  let waveManagers: WaveManagers = null;

  beforeAll(() => {
    waveManagers = waveUtils.createManagers(10);

    waveUtils.updateCandles(waveManagers, candles[0]);
    waveUtils.updateCandles(waveManagers, candles[1]);
    waveUtils.updateCandles(waveManagers, candles[2]);
    waveUtils.updateCandles(waveManagers, candles[3]);
    waveUtils.updateCandles(waveManagers, candles[4]);
    waveUtils.updateCandles(waveManagers, candles[5]);
    waveUtils.updateCandles(waveManagers, candles[6]);
    waveUtils.updateCandles(waveManagers, candles[7]);
    waveUtils.updateCandles(waveManagers, candles[8]);
    waveUtils.updateCandles(waveManagers, candles[9]);
    waveUtils.updateCandles(waveManagers, candles[10]);
    // waveUtils.updateCandles(waveManagers, candles[11]);
  });

  test("wave 0", () => {
    const candles = waveManagers.x120.getWaveCandles(0);
    expect(candles.map(x => x.close)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, undefined]);
  });

  test("wave 1", () => {
    const candles = waveManagers.x120.getWaveCandles(1);
    expect(candles.map(x => x.close)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, undefined, undefined]);
  });

  test("wave 2", () => {
    const candles = waveManagers.x120.getWaveCandles(2);
    expect(candles.map(x => x.close)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, undefined, undefined, undefined]);
  });

  test("wave 9", () => {
    const candles = waveManagers.x120.getWaveCandles(9);
    expect(candles.map(x => x.close)).toEqual([
      9,
      10,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ]);
  });

  test("wave 10", () => {
    const candles = waveManagers.x120.getWaveCandles(10);
    expect(candles.map(x => x.close)).toEqual([
      10,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ]);
  });

  test("wave 11", () => {
    const candles = waveManagers.x120.getWaveCandles(11);
    expect(candles.map(x => x.close)).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ]);
  });
});

describe("waveUtils | updateCandles | x1 2", () => {
  let waveManagers: WaveManagers = null;

  beforeAll(() => {
    waveManagers = waveUtils.createManagers(10);

    waveUtils.updateCandles(waveManagers, candles[0]);
    waveUtils.updateCandles(waveManagers, candles[1]);
    waveUtils.updateCandles(waveManagers, candles[2]);
    waveUtils.updateCandles(waveManagers, candles[3]);
    waveUtils.updateCandles(waveManagers, candles[4]);
    waveUtils.updateCandles(waveManagers, candles[5]);
    waveUtils.updateCandles(waveManagers, candles[6]);
    waveUtils.updateCandles(waveManagers, candles[7]);
    waveUtils.updateCandles(waveManagers, candles[8]);
    waveUtils.updateCandles(waveManagers, candles[9]);
    waveUtils.updateCandles(waveManagers, candles[10]);
    waveUtils.updateCandles(waveManagers, candles[11]);
    waveUtils.updateCandles(waveManagers, candles[12]);
    waveUtils.updateCandles(waveManagers, candles[13]);
  });

  test("wave 0", () => {
    const candles = waveManagers.x120.getWaveCandles(0);
    expect(candles.map(x => x.close)).toEqual([
      12,
      13,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ]);
  });

  test("wave 1", () => {
    const candles = waveManagers.x120.getWaveCandles(1);
    expect(candles.map(x => x.close)).toEqual([
      13,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ]);
  });

  test("wave 2", () => {
    const candles = waveManagers.x120.getWaveCandles(2);
    expect(candles.map(x => x.close)).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ]);
  });

  test("wave 9", () => {
    const candles = waveManagers.x120.getWaveCandles(9);
    expect(candles.map(x => x.close)).toEqual([
      9,
      10,
      11,
      12,
      13,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ]);
  });

  test("wave 10", () => {
    const candles = waveManagers.x120.getWaveCandles(10);
    expect(candles.map(x => x.close)).toEqual([
      10,
      11,
      12,
      13,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ]);
  });

  test("wave 11", () => {
    const candles = waveManagers.x120.getWaveCandles(11);
    expect(candles.map(x => x.close)).toEqual([
      11,
      12,
      13,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ]);
  });
});
