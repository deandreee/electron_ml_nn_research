// @link http://en.wikipedia.org/wiki/Exponential_moving_average#Exponential_moving_average
import { Candle } from "../../types";
import { WiMA } from "./WiMA";

export class TWIGGS3 {
  idx: number;
  period: number;
  prev: Candle;
  wimaAd: WiMA;
  wimaVol: WiMA;
  result: number;

  constructor(period: number) {
    this.idx = -1;
    this.period = period;
    this.wimaAd = new WiMA(period);
    this.wimaVol = new WiMA(period);
  }

  update = (candle: Candle): number => {
    /* Candle.close .high .open .low */
    ++this.idx;

    if (this.idx === 0) {
      this.prev = candle;
      return null;
    }

    this.result = this.calculate(candle);
    this.prev = candle;
    return this.result;
  };

  // lets try and merge these two
  // http://www.incrediblecharts.com/indicators/twiggs_money_flow.php
  // https://www.tradingview.com/script/Jccjg8CR-Indicators-Twiggs-Money-Flow-TMF-Wilder-s-MA-WiMA/
  calculate = (candle: Candle): number => {
    const lastClose = this.prev.close;

    // Basically, True Range High (TRH) is the greater of today's High and yesterday's Close.
    const trh = Math.max(candle.high, lastClose);

    // True Range Low (TRL) is the lesser of today's Low and yesterday's Close.
    const trl = Math.min(candle.low, lastClose);

    // Calculate AD using True Range High and True Range Low:
    // AD = {(Close - TRL) - (TRH - Close)} / {TRH - TRL} * Volume
    const up = candle.close - trl - (trh - candle.close);
    const down = (trh - trl) * candle.volume;
    const ad = up / down;

    const smoothAd = this.wimaAd.update(ad);
    const smoothVol = this.wimaVol.update(candle.volume);

    if (smoothVol === 0) {
      return 0;
    }

    return smoothAd / smoothVol;
  };
}
