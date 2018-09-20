import { CoinData, Candle } from "./types";

// return change as % like 5.8% not 0.058
export const getPctChange = (curr: number, prev: number) => {
  return ((curr - prev) / prev) * 100;
};

export const getCoinPctChange = (
  coin: CoinData,
  idxCurr: number,
  idxPrev: number
) => {
  return getCandlePctChange(coin.candles, idxCurr, idxPrev);
};

export const getCandlePctChange = (
  candles: Candle[],
  idxCurr: number,
  idxPrev: number
) => {
  if (idxPrev >= candles.length || idxPrev < 0) {
    throw new Error(
      `utils/getCoinPctChange: index out of bounds | length: ${
        candles.length
      } | idxPrev: ${idxPrev}`
    );
  }

  return getPctChange(candles[idxCurr].close, candles[idxPrev].close);
};
