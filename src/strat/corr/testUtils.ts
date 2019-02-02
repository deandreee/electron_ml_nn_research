import { Candle } from "../types";

export type Partial<T> = { [P in keyof T]?: T[P] };

export const createCandle = (partial: Partial<Candle>) => {
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

export const logCandleStart = (candle: Candle) => {
  console.log(new Date(candle.start * 1000));
};
