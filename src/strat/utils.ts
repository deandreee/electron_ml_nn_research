import { CoinData } from "./types";

// return change as % like 5.8% not 0.058
export const getPctChange = (curr: number, prev: number) => {
  return ((curr - prev) / prev) * 100;
};

export const getCoinPctChange = (
  coin: CoinData,
  idxCurr: number,
  idxPrev: number
) => {
  return getPctChange(coin.candles[idxCurr].close, coin.candles[idxPrev].close);
};
