// Wilders Moving Average for TWIGSS
// http://www.incrediblecharts.com/indicators/twiggs_money_flow.php
// http://www.incrediblecharts.com/indicators/wilder_moving_average.php

export class WiMA {
  period: number;
  result: number;
  price: number;
  age: number;
  history: number[];

  constructor(period: number) {
    this.period = period;
    this.age = 0;
    this.history = [];
  }

  update = (price: number) => {
    ++this.age;

    if (isNaN(price)) {
      throw new Error("EMA price NaN");
    }

    if (this.age < this.period) {
      this.result = price;
      this.history.push(price);
    }

    this.calculate(price);
    this.price = price;

    return this.result;
  };

  // EMA formula = price today * K + EMA yesterday * (1-K) where K = 2 / (N+1)
  // Wilder EMA formula = price today * K + EMA yesterday (1-K) where K =1/N
  calculate = (price: number) => {
    // weight factor
    var k = 1 / this.period;

    // yesterday
    var y = this.result;

    // calculation
    this.result = price * k + y * (1 - k);
  };
}
