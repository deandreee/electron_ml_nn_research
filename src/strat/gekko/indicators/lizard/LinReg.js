// from lizard/TriggerLines
// pretty much identical with LRC except for crazy swing at the start, so let's use LRC
class LinReg {
  constructor(period) {
    this.period = period;
    this.history = [];
  }

  enqueue(x) {
    let queue = this.history;
    if (queue.length >= this.period) {
      queue.shift();
    }

    queue.push(x);
  }

  getSum() {
    return this.history.reduce((acc, curr) => {
      return acc + curr;
    }, 0);
  }

  update(price) {
    this.enqueue(price);

    const sumX = this.period * (this.period - 1) * 0.5;
    const divisor =
      sumX * sumX -
      (this.period * this.period * (this.period - 1) * (2 * this.period - 1)) /
        6;

    let sumXY = 0;
    for (let count = 0; count < this.history.length; count++) {
      sumXY += count * this.history[this.history.length - 1 - count]; // reverse
    }

    const sumHistory = this.getSum();
    const slope = (this.period * sumXY - sumX * sumHistory) / divisor;
    const intercept = (sumHistory - slope * sumX) / this.period;

    this.result = intercept + slope * (this.period - 1);
    return { result: this.result, slope, intercept };
  }
}

module.exports = LinReg;
