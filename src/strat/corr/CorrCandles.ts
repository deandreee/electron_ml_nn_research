import { CoinData, Candle } from "../types";

export class CorrCandles {
  coin: CoinData;
  candles: Candle[];
  candlesActual: Candle[];
  WARMUP_IND: number;
  EXTENDED: number;

  constructor(coin: CoinData, candles: Candle[], candlesActual: Candle[], WARMUP_IND: number, EXTENDED: number) {
    this.coin = coin;
    this.candles = candles;
    this.candlesActual = candlesActual;
    this.WARMUP_IND = WARMUP_IND;
    this.EXTENDED = this.EXTENDED;
  }

  // candles actual is used further, but we still need to see the diff n periods ago,
  // so we look into full candles
  getPrev = (curr: number, minus: number) => {
    return this.candles[curr - minus + this.WARMUP_IND];
  };
}
