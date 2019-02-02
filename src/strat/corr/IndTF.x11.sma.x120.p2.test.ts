import * as waveUtils from "./waveUtils";
import { createCandle } from "./testUtils";
import { WaveManagers } from "../indicators/gekko";

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
    createCandle({ close: 9, start: 10, open: 10, high: 20, low: 20 }),
    createCandle({ close: 10, start: 10, open: 10, high: 20, low: 20 }),
    createCandle({ close: 11, start: 10, open: 10, high: 20, low: 20 }),
    createCandle({ close: 12, start: 10, open: 10, high: 20, low: 20 })
  ];

  let waveManagers: WaveManagers = null;

  beforeAll(() => {
    waveManagers = waveUtils.createManagers(10);
    // const sma = new IndTimeframeGroup(SMA, waveManagers, { x120: true }, {});

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
    expect(candles.map(x => x.close)).toEqual([0, 1]);
  });

  test("wave 1", () => {
    const candles = waveManagers.x120.getWaveCandles(1);
    expect(candles.map(x => x.close)).toEqual([0, 1]);
  });
});
