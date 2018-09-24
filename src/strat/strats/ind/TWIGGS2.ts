// @link http://en.wikipedia.org/wiki/Exponential_moving_average#Exponential_moving_average
import { Candle } from "../../types";
import { EMA } from "./EMA";

export class TWIGGS2 {
  age: number;
  period: number;
  ema: EMA;
  ema2: EMA;
  ema3: EMA;
  ema3_weight: number;
  result: number;
  ll: number;
  hh: number;
  prev: Candle;
  history: Candle[];

  constructor(period: number) {
    this.age = -1;
    this.ema = new EMA(21);
    this.ema2 = new EMA(21);
    this.ema3 = new EMA(period);
    this.period = period;
    this.result = -1;
    this.ll = -1;
    this.hh = -1;
    this.prev = null;
    this.history = [];
  }

  update = (candle: Candle) => {
    /* Candle.close .high .open .low */
    ++this.age;
    this.history.push(candle);

    if (this.age < this.period) {
      return null;
    }

    this.calculate(candle);
    this.prev = candle;
    return this.result;
  };

  // from here, looks complete BS because comments and variable names don't even match

  // method = moving average, user defined, default is EMA
  //period = user defined, default is 21
  //ma = moving average
  //trh = true high
  //trl = true low
  //prev = previous, index = current bar number
  //LT = lessThan, MT = moreThan
  // TMF = EMA[Volume *((Close - LL) / (HH - LL) * 2 - 1 )] / EMA[Volume] * 100
  calculate = (candle: Candle): number => {
    const periodCandles = this.history.slice(-this.period).map(x => x.close);
    const trh = Math.max(...periodCandles);
    const trl = Math.min(...periodCandles);

    const ad =
      ((candle.close - trl - (trh - candle.close)) / (trh - trl)) *
      candle.volume;

    const smoothAd = this.ema.update(ad);
    const smoothVol = this.ema2.update(candle.volume);
    return smoothAd / smoothVol;
  };
}
