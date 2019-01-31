import { CoinData, Candle } from "../types";
import { batchCandlesInXs } from "./batchCandlesInXs";

describe("batchCandlesInXs", () => {
  let coin: CoinData = null;

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

    coin = {
      name: "BTC",
      candles: first10
    };

    batchCandlesInXs(coin, 3);
  });

  // last partial is removed, check comment in batched
  test("candlesActual.length", () => {
    expect(coin.candles.length).toEqual(3);
  });

  test("0", () => {
    expect(coin.candles[0].close).toEqual(3);
    expect(coin.candles[0].start).toEqual(1);
    expect(coin.candles[0].open).toEqual(1);
    expect(coin.candles[0].high).toEqual(13);
    expect(coin.candles[0].low).toEqual(11);
  });

  test("1", () => {
    expect(coin.candles[1].close).toEqual(6);
    expect(coin.candles[1].start).toEqual(4);
    expect(coin.candles[1].open).toEqual(4);
    expect(coin.candles[1].high).toEqual(16);
    expect(coin.candles[1].low).toEqual(14);
  });

  test("2", () => {
    expect(coin.candles[2].close).toEqual(9);
    expect(coin.candles[2].start).toEqual(7);
    expect(coin.candles[2].open).toEqual(7);
    expect(coin.candles[2].high).toEqual(19);
    expect(coin.candles[2].low).toEqual(17);
  });
});

const createCandle = (partial: Partial<Candle>) => {
  const candle: Candle = {
    close: 0,
    start: 0,
    open: 0,
    high: 0,
    low: 0,
    volume: 0,
    vwp: 0,
    trades: 0,

    percentChange: 0,
    pctChange60m: 0,
    pctChange: {},

    ...partial
  };

  return candle;
};

type Partial<T> = { [P in keyof T]?: T[P] };
