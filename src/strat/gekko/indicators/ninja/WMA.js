const IndBase = require("../IndBase");

// The WMA (Weighted Moving Average) from Ninja

// they differ (with WMA_Gab0) very slightly on 60m/60period candles at least... possibly more diff on smaller candles/periods
// yes, ofcourse more diff on smaller period, USE THIS ONE not GAB0
// and the diff is, Gab0 multiplies with 0 not 1 on first ... I think 1 is more correct also ninja uses it

class WMA extends IndBase {
  constructor(period, props) {
    super(props);
    this.input = "price";
    this.period = period;

    this.result = null;

    this.priceHistory = []; // using this.resultHistory messes up Math.min calc :/ need a better way
  }

  updateCore(price) {
    this.priceHistory.push(price);

    //  can;t test like this because strat pushes null candles while waiting for start candles..., need a better way
    // if (this.resultHistory.length === 0) {

    if (this.priceHistory.length === 0) {
      this.result = price;
      return this.result;
    }

    let val = 0;
    let weight = 0;

    for (let i = 0; i < this.priceHistory.length; i++) {
      val += (i + 1) * this.priceHistory[i];
      weight += i + 1;
    }

    if (this.priceHistory.length > this.period) {
      this.priceHistory.shift();
    }

    this.result = val / weight;
    return this.result;
  }
}

module.exports = WMA;
