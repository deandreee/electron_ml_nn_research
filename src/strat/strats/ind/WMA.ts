// https://github.com/jmatty1983/gekkoIndicators/blob/master/WMA.js

import { Candle } from "../../types";

export class WMA {
  period: number;
  result: number;
  history: Candle[];

  constructor(period: number) {
    this.period = period;
    this.result = -1;
    this.history = [];
  }

  update(candle: Candle) {
    this.history.push(candle);

    if (this.history.length === this.period) {
      this.result = this.getWMA();
      this.history.shift();
    }
  }

  getWMA() {
    let total = 0;
    let weight = 0;

    this.history.forEach((v, i) => {
      total += v.close * (i + 1);
      weight += i + 1;
    });

    return total / weight;
  }
}
