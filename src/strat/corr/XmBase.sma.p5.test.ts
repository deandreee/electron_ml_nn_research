import { createCandle } from "./testUtils";
import { XmBase, SMA } from "../indicators/gekko";
import * as waveUtils from "./waveUtils";
import { Candle } from "../types";

describe("XmBase.sma.p5.test", () => {
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
    const xmBase = new XmBase(waveManagers.x240, () => new SMA(10));

    let res = null;
    res = xmBase.update(candles[0].close);
    res = xmBase.update(candles[1].close);
    res = xmBase.update(candles[2].close);
    res = xmBase.update(candles[3].close);
    res = xmBase.update(candles[4].close);

    expect(res).toEqual(2);
  });

  test("update x1", () => {
    const waveManagers = waveUtils.createManagers(10);
    const xmBase = new XmBase(waveManagers.x120, () => new SMA(10));

    let res = null;
    res = updateX(xmBase, candles[0], 12);
    res = updateX(xmBase, candles[1], 12);
    res = updateX(xmBase, candles[2], 12);
    res = updateX(xmBase, candles[3], 12);
    res = updateX(xmBase, candles[4], 12);
    res = updateX(xmBase, candles[5], 12);
    res = updateX(xmBase, candles[6], 12);
    res = updateX(xmBase, candles[7], 12);
    res = updateX(xmBase, candles[8], 12);

    res = xmBase.update(candles[9].close);
    expect(res).toEqual(4.5);

    res = xmBase.update(candles[9].close);
    expect(res).toEqual(4.5);

    res = xmBase.update(candles[9].close);
    expect(res).toEqual(4.5);

    res = xmBase.update(candles[9].close);
    expect(res).toEqual(4.5);

    res = xmBase.update(candles[9].close);
    expect(res).toEqual(4.5);

    res = xmBase.update(candles[9].close);
    expect(res).toEqual(4.5);

    res = xmBase.update(candles[9].close);
    expect(res).toEqual(4.5);

    res = xmBase.update(candles[9].close);
    expect(res).toEqual(4.5);

    res = xmBase.update(candles[9].close);
    expect(res).toEqual(4.5);

    res = xmBase.update(candles[9].close);
    expect(res).toEqual(4.5);

    res = xmBase.update(candles[9].close);
    expect(res).toEqual(4.5);

    res = xmBase.update(candles[9].close);
    expect(res).toEqual(4.5);

    // one over
    res = xmBase.update(candles[9].close);
    expect(res).toEqual(5.4);
  });

  test("update x1", () => {
    const waveManagers = waveUtils.createManagers(60);
    const xmBase = new XmBase(waveManagers.x240, () => new SMA(10));

    let res = null;
    res = updateX(xmBase, candles[0], 4);
    res = updateX(xmBase, candles[1], 4);
    res = updateX(xmBase, candles[2], 4);
    res = updateX(xmBase, candles[3], 4);
    res = updateX(xmBase, candles[4], 4);
    res = updateX(xmBase, candles[5], 4);
    res = updateX(xmBase, candles[6], 4);
    res = updateX(xmBase, candles[7], 4);
    res = updateX(xmBase, candles[8], 4);
    res = updateX(xmBase, candles[9], 4);

    expect(res).toEqual(4.5);
  });
});

const updateX = (xmBase: any, candle: Candle, times: number) => {
  let res = null;
  for (let i = 0; i < times; i++) {
    res = xmBase.update(candle.close);
  }
  return res;
};
