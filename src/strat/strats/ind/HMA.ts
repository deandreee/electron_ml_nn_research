// https://github.com/jmatty1983/gekkoIndicators/blob/master/HMA.js
import { Candle } from "../../types";
import { WMA } from "./WMA";

export class HMA {
  period: number;
  result: number;
  history: Candle[];
  frontWMA: WMA;
  backWMA: WMA;
  HMA: WMA;

  constructor(period: number) {
    this.period = period;
    this.result = -1;

    this.frontWMA = new WMA(Math.round(period / 2));
    this.backWMA = new WMA(period);
    this.HMA = new WMA(Math.round(Math.sqrt(period)));
  }

  update(candle: Candle) {
    this.frontWMA.update(candle);
    this.backWMA.update(candle);

    if (!this.frontWMA.result || !this.backWMA.result) {
      this.result = null;
      return null;
    }

    const front = 2 * this.frontWMA.result;
    const back = this.frontWMA.result;

    this.HMA.update({ close: front - back } as Candle);
    this.result = this.HMA.result;

    return this.result;
  }
}
