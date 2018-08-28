// @link http://en.wikipedia.org/wiki/Exponential_moving_average#Exponential_moving_average
import { Candle } from "../../types";
import { EMA } from "./EMA";

export class TWIGGS {
  age: number;
  ema: EMA;
  ema2: EMA;
  ema3: EMA;
  ema3_weight: number;
  result: number;
  ll: number;
  hh: number;
  prev: Candle;

  constructor(period: number) {
    this.age = -1;
    this.ema = new EMA(21);
    this.ema2 = new EMA(21);
    this.ema3 = new EMA(period);
    this.ema3_weight = period;
    this.result = -1;
    this.ll = -1;
    this.hh = -1;
    this.prev = null;
  }

  update = (candle: Candle) => {
    /* Candle.close .high .open .low */
    ++this.age;

    /* This.result == false by defaults, so if it's still false
       It means this is the first time we update the indicator */
    if (this.result === -1) {
      // When we have no results we watch the first candle
      this.hh = candle.close;
      this.ll = candle.close;
    } else {
      this.hh = Math.max(this.hh, this.prev.close);
      this.ll = Math.min(this.ll, this.prev.close);
    }

    if (this.age < this.ema3_weight) {
      this.prev = candle;
      return null;
    }

    this.calculate(candle);
    this.prev = candle;
    return this.result;
  };

  // TMF = EMA[Volume *((Close - LL) / (HH - LL) * 2 - 1 )] / EMA[Volume] * 100
  calculate = (candle: Candle) => {
    var leftpart = candle.close - this.ll - (this.hh - candle.close);
    var rightpart = ((this.hh - this.ll) * candle.volume) | 0.0000001;

    var range = leftpart / rightpart;
    var rangeVolume = this.ema.update(range || 0);

    var e2 = this.ema2.update(candle.volume);
    var TMF = (rangeVolume / e2) * 100;

    this.result = TMF;
  };
}
