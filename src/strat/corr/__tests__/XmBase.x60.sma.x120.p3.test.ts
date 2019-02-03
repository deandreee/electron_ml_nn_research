import * as waveUtils from "../waveUtils";
import { createCandle } from "../testUtils";
import { XmBase, SMA } from "../../indicators/gekko";

describe("XmBase x60 | sma x120 p3", () => {
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

  test("update x1", () => {
    const waveManagers = waveUtils.createManagers(60);
    const xmBase = new XmBase(waveManagers.x120, () => new SMA(3));

    let bigCandle = null;
    let res = null;

    bigCandle = waveManagers.x120.update(candles[0]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[1]);
    res = xmBase.update(bigCandle && bigCandle.close);

    bigCandle = waveManagers.x120.update(candles[2]);
    res = xmBase.update(bigCandle && bigCandle.close);

    expect(res).toEqual(2);
  });

  test("update x1 + 1", () => {
    const waveManagers = waveUtils.createManagers(60);
    const xmBase = new XmBase(waveManagers.x120, () => new SMA(3));

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

    expect(res).toEqual(2); // (3 + 1) / 2
  });

  test("update x1 + 2", () => {
    const waveManagers = waveUtils.createManagers(60);
    const xmBase = new XmBase(waveManagers.x120, () => new SMA(3));

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

    expect(res).toEqual(3); // (4 + 2) / 2
  });

  test("update x2", () => {
    const waveManagers = waveUtils.createManagers(60);
    const xmBase = new XmBase(waveManagers.x120, () => new SMA(3));

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

    expect(res).toEqual(3); // (5 + 3 + 1) / 3
  });

  test("update x2 + 1", () => {
    const waveManagers = waveUtils.createManagers(60);
    const xmBase = new XmBase(waveManagers.x120, () => new SMA(3));

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

    expect(res).toEqual(4); // (6 + 4 + 2) / 3
  });
});
