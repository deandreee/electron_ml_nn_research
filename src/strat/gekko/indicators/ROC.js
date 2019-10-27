// ROC indicator, ported by Gab0
// 10-april-2018 v1.0final

const IndBase = require("./IndBase");

class ROC extends IndBase {
  constructor(windowLength, props) {
    super(props);
    this.input = "price";
    this.windowLength = windowLength;
    this.prices = [];
    this.result = 0;
    this.age = 0;
    this.sum = 0;
  }

  updateCore(price) {
    var tail = this.prices[this.age] || 0; // oldest price in window
    this.prices[this.age] = price;

    this.result = ((price - tail) / tail) * 100;
    this.age = (this.age + 1) % this.windowLength;

    return this.result;
  }
}

module.exports = ROC;
