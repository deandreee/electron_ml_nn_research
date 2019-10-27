// Linear regression curve
const IndBase = require("./IndBase");

class Volume extends IndBase {
  constructor(period, props) {
    super(props);
    this.period = period;
    this.input = "candle";
    this.history = [];
    this.result = 0;
  }

  enqueue(x) {
    let queue = this.history;
    if (queue.length >= this.period) {
      const first = queue.shift();
      this.result -= first;
    }

    queue.push(x);
    this.result += x;
  }

  updateCore(candle) {
    this.enqueue(candle.volume);

    if (this.history.length < this.period) {
      return;
    }

    return this.result;
  }
}

module.exports = Volume;
