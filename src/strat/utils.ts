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
  if (idxPrev >= coin.candles.length || idxPrev < 0) {
    throw new Error(
      `utils/getCoinPctChange: index out of bounds | length: ${
        coin.candles.length
      } | idxPrev: ${idxPrev}`
    );
  }

  return getPctChange(coin.candles[idxCurr].close, coin.candles[idxPrev].close);
};
