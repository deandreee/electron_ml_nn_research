import { CoinData, Candle } from "./types";

// return change as % like 5.8% not 0.058
export const getPctChange = (curr: number, prev: number) => {
  return ((curr - prev) / prev) * 100;
};

export const getCoinPctChange = (coin: CoinData, idxCurr: number, idxPrev: number) => {
  return getCandlePctChange(coin.candles, idxCurr, idxPrev);
};

export const getCandlePctChange = (candles: Candle[], idxCurr: number, idxPrev: number) => {
  checkIdx(candles, idxPrev);

  return getPctChange(candles[idxCurr].close, candles[idxPrev].close);
};

export const getMaxCandlePctChange = (candles: Candle[], from: number, to: number) => {
  checkIdx(candles, from);
  checkIdx(candles, to);

  let max = -Infinity;
  for (let i = from; i < to; i++) {
    let change = getPctChange(candles[i].close, candles[from].close);
    if (change > max) {
      max = change;
    }
  }

  return max;
};

const checkIdx = (candles: Candle[], idx: number) => {
  if (idx >= candles.length || idx < 0) {
    throw new Error(`utils/getCoinPctChange: index out of bounds | length: ${candles.length} | idxPrev: ${idx}`);
  }
};

export const getAvgCandlePctChange = (candles: Candle[], idxCurr: number, idxAvgFrom: number, idxAvgTo: number) => {
  checkIdx(candles, idxCurr);
  checkIdx(candles, idxAvgFrom);
  checkIdx(candles, idxAvgTo);

  let sum = 0;
  // skip <= otherwise / length (idxAvgTo - idxAvgFrom) has 1 too much
  for (let i = idxAvgFrom; i < idxAvgTo; i++) {
    sum += getPctChange(candles[i].close, candles[idxCurr].close);
  }

  return round1(sum / (idxAvgTo - idxAvgFrom));
};

export const times = (x: number) => {
  const res = [];
  for (let i = 0; i < x; i++) {
    res.push(i);
  }
  return res;
};

export const round1 = (value: number) => {
  return Math.round(value * 10) / 10;
};

export const round2 = (value: number) => {
  return Math.round(value * 100) / 100;
};

type fnGetNum = (x: any) => number;

export const avg = (arr: any[], fnGetNum: fnGetNum) => {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += fnGetNum(arr[i]);
  }
  return sum / arr.length;
};

type Cb = (x: any) => any;

export const fromCb = (cb: Cb) => {
  return new Promise((resolve, reject) => {
    try {
      cb((err: any, value: any) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(value);
      });
    } catch (err) {
      reject(err);
    }
  });
};

// 1st arg is value not err :/
export const fromCbGauss = (cb: Cb) => {
  return new Promise((resolve, reject) => {
    try {
      cb((value: any) => {
        resolve(value);
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const mapObj = (obj: object, fn: (k: string) => object) => {
  return Object.assign({}, ...Object.keys(obj).map(k => ({ [k]: fn(k) })));
};
