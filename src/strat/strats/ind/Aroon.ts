import { Candle, IndChannel } from "../../types";

export class Aroon {
  period: number;
  highs: number[];
  lows: number[];

  constructor(period: number) {
    this.highs = [];
    this.lows = [];
    this.period = period;
  }

  update(candle: Candle): IndChannel {
    this.highs.push(candle.high);
    this.lows.push(candle.low);

    if (this.highs.length < this.period) {
      return { up: null, down: null };
    }

    let highIdx = this.highs.indexOf(Math.max.apply(null, this.highs)) + 1;
    let lowIdx = this.lows.indexOf(Math.min.apply(null, this.lows)) + 1;

    const result = {
      up: ((this.period - (this.period - highIdx)) / this.period) * 100,
      down: ((this.period - (this.period - lowIdx)) / this.period) * 100
    };

    this.highs.shift();
    this.lows.shift();

    return result;
  }
}
