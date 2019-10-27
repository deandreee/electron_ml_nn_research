/*
 * CCI
 */
const LRC = require("./LRC");
const IndBase = require("./IndBase");

class CCI extends IndBase {
  constructor(settings, props) {
    super(props);
    this.input = "candle";
    this.tp = 0.0;
    this.TP = new LRC(settings.history);
    this.result = false;
    this.hist = []; // needed for mean?
    this.mean = 0.0;
    this.size = 0;
    this.constant = settings.constant;
    this.maxSize = settings.history;
    for (var i = 0; i < this.maxSize; i++) this.hist.push(0.0);
  }

  updateCore(candle) {
    // We need sufficient history to get the right result.

    var tp = (candle.high + candle.close + candle.low) / 3;
    if (this.size < this.maxSize) {
      this.hist[this.size] = tp;
      this.size++;
    } else {
      for (var i = 0; i < this.maxSize - 1; i++) {
        this.hist[i] = this.hist[i + 1];
      }
      this.hist[this.maxSize - 1] = tp;
    }

    this.TP.update(tp);

    if (this.size < this.maxSize) {
      this.result = false;
    } else {
      this.calculate(tp);
    }

    return this.result;
  }

  /*
 * Handle calculations
 */
  calculate(tp) {
    // calculate current TP

    var avgtp = this.TP.result;
    if (typeof avgtp == "boolean") {
      throw new Error("Failed to get average tp from indicator.");
    }

    this.tp = tp;

    var sum = 0.0;
    // calculate tps
    for (var i = 0; i < this.size; i++) {
      var z = this.hist[i] - avgtp;
      if (z < 0) z = z * -1.0;
      sum = sum + z;
    }

    this.mean = sum / this.size;

    this.result = (this.tp - avgtp) / (this.constant * this.mean);
  }
}

module.exports = CCI;
