import * as waveUtils from "../waveUtils";
import { createCandle } from "../testUtils";
import { XmBase, SMA } from "../../indicators/gekko";

describe("XmBase x10 | sma x120 p2", () => {
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

  test("x1 -1", () => {
    const waveManagers = waveUtils.createManagers(10);
    const xmBase = new XmBase(waveManagers.x120, () => new SMA(2));

    let bigCandle = null;
    let res = null;
    bigCandle = waveManagers.x120.update(candles[0]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[1]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[2]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[3]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[4]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[5]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[6]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[7]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[8]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[9]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[10]);
    res = xmBase.update(bigCandle && bigCandle.close);

    expect(bigCandle).toBeNull();
    expect(res).toBeNull();
  });

  test("x1", () => {
    const waveManagers = waveUtils.createManagers(10);
    const xmBase = new XmBase(waveManagers.x120, () => new SMA(2));

    let bigCandle = null;
    let res = null;

    bigCandle = waveManagers.x120.update(candles[0]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[1]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[2]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[3]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[4]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[5]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[6]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[7]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[8]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[9]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[10]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[11]);
    res = xmBase.update(bigCandle && bigCandle.close);

    expect(bigCandle).not.toBeNull();
    expect(bigCandle.close).toEqual(11);
    expect(res).toEqual(11);
  });

  test("x1 + 1", () => {
    const waveManagers = waveUtils.createManagers(10);
    const xmBase = new XmBase(waveManagers.x120, () => new SMA(2));

    let bigCandle = null;
    let res = null;

    bigCandle = waveManagers.x120.update(candles[0]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[1]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[2]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[3]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[4]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[5]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[6]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[7]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[8]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[9]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[10]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[11]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[12]);
    res = xmBase.update(bigCandle && bigCandle.close);

    expect(bigCandle).not.toBeNull();
    expect(bigCandle.close).toEqual(12);
    expect(res).toEqual(12);
  });
});
