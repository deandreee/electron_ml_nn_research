import * as waveUtils from "../waveUtils";
import { createCandle } from "../testUtils";
import { SMA } from "../../indicators/SMA";
import { IndTimeframeGroup } from "../../indicators/IndTimeframeGroup";

describe("IndTimeframeGroup.x10.sma.x120", () => {
  const candles = [
    createCandle({ close: 0, start: 0, open: 1, high: 11, low: 11 }),
    createCandle({ close: 1, start: 1, open: 2, high: 12, low: 12 }),
    createCandle({ close: 2, start: 2, open: 3, high: 13, low: 13 }),
    createCandle({ close: 3, start: 3, open: 4, high: 14, low: 14 }),
    createCandle({ close: 4, start: 4, open: 5, high: 15, low: 15 }),
    createCandle({ close: 5, start: 5, open: 6, high: 16, low: 16 }),
    createCandle({ close: 6, start: 6, open: 7, high: 17, low: 17 }),
    createCandle({ close: 7, start: 7, open: 8, high: 18, low: 18 }),
    createCandle({ close: 8, start: 8, open: 9, high: 19, low: 19 }),
    createCandle({ close: 9, start: 9, open: 10, high: 20, low: 20 }),
    createCandle({ close: 10, start: 10, open: 10, high: 20, low: 20 }),
    createCandle({ close: 11, start: 11, open: 10, high: 20, low: 20 }),
    createCandle({ close: 12, start: 12, open: 10, high: 20, low: 20 }),
    createCandle({ close: 13, start: 13, open: 10, high: 20, low: 20 })
  ];

  test("x1 -1", () => {
    const waveManagers = waveUtils.createManagers(10);

    let bigCandles = null;

    bigCandles = waveUtils.updateCandles(waveManagers, candles[0]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[1]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[2]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[3]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[4]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[5]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[6]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[7]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[8]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[9]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[10]);

    expect(bigCandles.x120).toBeNull();
  });

  test("x1", () => {
    const waveManagers = waveUtils.createManagers(10);
    const sma = new IndTimeframeGroup(SMA, waveManagers, { x120: true }, {});

    let bigCandles = null;
    let res = null;

    bigCandles = waveUtils.updateCandles(waveManagers, candles[0]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[1]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[2]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[3]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[4]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[5]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[6]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[7]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[8]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[9]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[10]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[11]);

    res = sma.update(bigCandles);

    expect(bigCandles.x120).not.toBeNull();
    expect(bigCandles.x120.close).toEqual(11);
    expect(bigCandles.x120.start).toEqual(0);
    expect(res.x120.p10).toEqual(11);
  });

  test("x1 + 1", () => {
    const waveManagers = waveUtils.createManagers(10);
    const sma = new IndTimeframeGroup(SMA, waveManagers, { x120: true }, {});

    let bigCandles = null;
    let res = null;

    bigCandles = waveUtils.updateCandles(waveManagers, candles[0]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[1]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[2]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[3]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[4]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[5]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[6]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[7]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[8]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[9]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[10]);

    bigCandles = waveUtils.updateCandles(waveManagers, candles[11]);
    res = sma.update(bigCandles);

    bigCandles = waveUtils.updateCandles(waveManagers, candles[12]);
    res = sma.update(bigCandles);

    expect(bigCandles.x120).not.toBeNull();
    expect(bigCandles.x120.close).toEqual(12);
    expect(res.x120.p10).toEqual(12);
  });

  test("x1 + 2", () => {
    const waveManagers = waveUtils.createManagers(10);
    const sma = new IndTimeframeGroup(SMA, waveManagers, { x120: true }, {});

    let bigCandles = null;
    let res = null;

    bigCandles = waveUtils.updateCandles(waveManagers, candles[0]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[1]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[2]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[3]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[4]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[5]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[6]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[7]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[8]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[9]);
    bigCandles = waveUtils.updateCandles(waveManagers, candles[10]);

    bigCandles = waveUtils.updateCandles(waveManagers, candles[11]);
    res = sma.update(bigCandles);

    bigCandles = waveUtils.updateCandles(waveManagers, candles[12]);
    res = sma.update(bigCandles);

    bigCandles = waveUtils.updateCandles(waveManagers, candles[13]);
    res = sma.update(bigCandles);

    expect(bigCandles.x120).not.toBeNull();
    expect(bigCandles.x120.close).toEqual(13);
    expect(res.x120.p10).toEqual(13);
  });

  test("x10 loop", () => {
    const waveManagers = waveUtils.createManagers(10);
    const sma = new IndTimeframeGroup(SMA, waveManagers, { x120: true }, {});

    let bigCandles = null;
    let res = null;

    for (let i = 0; i < 10; i++) {
      bigCandles = waveUtils.updateCandles(waveManagers, candles[0]);
      bigCandles = waveUtils.updateCandles(waveManagers, candles[1]);
      bigCandles = waveUtils.updateCandles(waveManagers, candles[2]);
      bigCandles = waveUtils.updateCandles(waveManagers, candles[3]);
      bigCandles = waveUtils.updateCandles(waveManagers, candles[4]);
      bigCandles = waveUtils.updateCandles(waveManagers, candles[5]);
      bigCandles = waveUtils.updateCandles(waveManagers, candles[6]);
      bigCandles = waveUtils.updateCandles(waveManagers, candles[7]);
      bigCandles = waveUtils.updateCandles(waveManagers, candles[8]);
      bigCandles = waveUtils.updateCandles(waveManagers, candles[9]);
      bigCandles = waveUtils.updateCandles(waveManagers, candles[10]);
      bigCandles = waveUtils.updateCandles(waveManagers, candles[11]);

      res = sma.update(bigCandles);

      expect(bigCandles.x120).not.toBeNull();
      expect(bigCandles.x120.close).toEqual(11);
      expect(bigCandles.x120.start).toEqual(0);
      expect(res.x120.p10).toEqual(11);
    }
  });
});
