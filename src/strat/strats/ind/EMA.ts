// @link http://en.wikipedia.org/wiki/Exponential_moving_average#Exponential_moving_average

export class EMA {
  period: number;
  result: number;
  price: number;
  age: number;

  constructor(period: number) {
    this.period = period;
    this.result = -1;
    this.age = 0;
  }

  update = (price: number) => {
    if (isNaN(price)) {
      throw new Error("EMA price NaN");
    }

    // The first time we can't calculate based on previous
    // ema, because we haven't calculated any yet.
    if (this.result === -1) {
      this.result = price;
    }

    this.age++;
    this.calculate(price);
    this.price = price;

    return this.result;
  };

  //    calculation (based on tick/day):
  //  EMA = Price(t) * k + EMA(y) * (1 – k)
  //  t = today, y = yesterday, N = number of days in EMA, k = 2 / (N+1)
  calculate = (price: number) => {
    // weight factor
    var k = 2 / (this.period + 1);

    // yesterday
    var y = this.result;

    // calculation
    this.result = price * k + y * (1 - k);
  };
}
