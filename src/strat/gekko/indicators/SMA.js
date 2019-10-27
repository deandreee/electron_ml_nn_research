// required indicators
// Simple Moving Average - O(1) implementation

const IndBase = require("./IndBase");

class SMA extends IndBase {
  constructor(windowLength, props) {
    super(props);
    this.input = "price";
    this.windowLength = windowLength;
    this.prices = [];
    this.result = 0;
    this._age = 0; // need to rename, conflict with IndCore
    this.sum = 0;
  }

  updateCore(price) {
    // console.log('SMA update', price);

    var tail = this.prices[this._age] || 0; // oldest price in window
    this.prices[this._age] = price;
    this.sum += price - tail;
    this.result = this.sum / this.prices.length;
    this._age = (this._age + 1) % this.windowLength;

    // ask
    this.price = price;

    // console.log('SMA', this._age, this.prices);
    return this.result;
  }
}

module.exports = SMA;
