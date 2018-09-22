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
  checkIdx(candles, idxPrev);

  return getPctChange(candles[idxCurr].close, candles[idxPrev].close);
};

export const getMaxCandlePctChange = (
  candles: Candle[],
  idxCurr: number,
  idxPrev: number
) => {
  checkIdx(candles, idxPrev);

  let max = -Infinity;
  for (let i = idxPrev + 1; i <= idxCurr; i++) {
    let change = getPctChange(candles[i].close, candles[idxPrev].close);
    if (change > max) {
      max = change;
    }
  }

  return max;
};

const checkIdx = (candles: Candle[], idx: number) => {
  if (idx >= candles.length || idx < 0) {
    throw new Error(
      `utils/getCoinPctChange: index out of bounds | length: ${
        candles.length
      } | idxPrev: ${idx}`
    );
  }
};

export const getAvgCandlePctChange = (
  candles: Candle[],
  idxCurr: number,
  idxAvgFrom: number,
  idxAvgTo: number
) => {
  checkIdx(candles, idxCurr);
  checkIdx(candles, idxAvgFrom);
  checkIdx(candles, idxAvgTo);

  let sum = 0;
  for (let i = idxAvgFrom; i <= idxAvgTo; i++) {
    sum += getPctChange(candles[i].close, candles[idxCurr].close);
  }

  return Math.round((sum / (idxAvgTo - idxAvgFrom)) * 10) / 10;
};

export const times = (x: number) => {
  const res = [];
  for (let i = 0; i < x; i++) {
    res.push(i);
  }
  return res;
};
