import { CoinData, Candle } from "../types";
import { batchCandlesInXs } from "./batchCandlesInXs";

describe("batchCandlesInXs", () => {
  let coin: CoinData = null;

  beforeAll(() => {
    const first10 = [
      createCandle({ close: 1, start: 1 }),
      createCandle({ close: 2, start: 2 }),
      createCandle({ close: 3, start: 3 }),
      createCandle({ close: 4, start: 4 }),
      createCandle({ close: 5, start: 5 }),
      createCandle({ close: 6, start: 6 }),
      createCandle({ close: 7, start: 7 }),
      createCandle({ close: 8, start: 8 }),
      createCandle({ close: 9, start: 9 }),
      createCandle({ close: 10, start: 10 })
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
  });

  test("1", () => {
    expect(coin.candles[1].close).toEqual(6);
    expect(coin.candles[1].start).toEqual(4);
  });

  test("2", () => {
    expect(coin.candles[2].close).toEqual(9);
    expect(coin.candles[2].start).toEqual(7);
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
