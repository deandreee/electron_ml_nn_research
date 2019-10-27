const IndBase = require("./IndBase");

//WMA port by Gab0 - 03/29/2018;

// yeah I'm not sure this WMA actually the same indicators as other WMAs, because I think there is Williams MA and Weighted MA and probably some othes WMAs...
// I'll just re-implement the Ninja one

class WMA_Gab0 extends IndBase {
  constructor(period, props) {
    super(props);
    this.input = "price";
    this.windowLength = period;
    this.prices = [];
    this.result = 0;
    this.age = 0;
    this.sum = 0;
  }

  updateCore(price) {
    this.prices.push(price);

    var psum = 0;
    var pdiv = 0;

    for (var j = 0; j < this.prices.length; j++) {
      psum += j * this.prices[j];
      pdiv += j;
    }

    this.result = psum / pdiv;
    if (this.prices.length > this.windowLength) {
      this.prices.shift();
    }

    this.age = (this.age + 1) % this.windowLength;

    return this.result;
  }
}

module.exports = WMA_Gab0;
