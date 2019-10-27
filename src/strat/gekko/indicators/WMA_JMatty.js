// https://raw.githubusercontent.com/jmatty1983/gekkoIndicators
class Indicator {
  constructor(period) {
    this.input = "price";
    this.period = period;
    this.result = false;

    this.history = [];
  }

  update(price) {
    this.history.push(price);

    if (this.history.length === this.period) {
      this.result = this.getWMA();

      this.history.shift();
    }
  }

  getWMA() {
    let total = 0;
    let weight = 0;

    this.history.forEach((v, i) => {
      total += v * (i + 1);
      weight += i + 1;
    });

    return total / weight;
  }
}

module.exports = Indicator;
