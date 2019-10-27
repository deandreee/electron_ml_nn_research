// Linear regression curve
const IndBase = require("./IndBase");

class Indicator extends IndBase {
  constructor(depth, props) {
    super(props);
    this.input = "price";
    this.depth = depth;
    this.props = props || {};
    this.result = null;
    this.age = 0;
    this.history = [];
    this.resultHistory = [];
    this.x = [];
    /*
   * Do not use array(depth) as it might not be implemented
   */
    for (var i = 0; i < this.depth; i++) {
      this.history.push(0.0);
      this.x.push(i);
    }
  }

  updateCore(price) {
    if (price === null) {
      this.result = null;
      return null;
    }

    // We need sufficient history to get the right result.
    if (this.result === null && this.age < this.depth) {
      this.history[this.age] = price;
      this.age++;
      this.result = null;
      return null;
    }

    this.age++;
    // shift history
    for (var i = 0; i < this.depth - 1; i++) {
      this.history[i] = this.history[i + 1];
    }
    this.history[this.depth - 1] = price;

    this.calculate(price);

    // const resultPrev = this.resultHistory[this.resultHistory.length - 20];

    return this.result;

    // remove for now, conflict with this.result
    // m: this.m,
    // b: this.b,
    // angle: (Math.atan(this.m) * 180) / Math.PI,
    // y=1 is reasonable but gives result between 2 and -2
    // also, fires faster than angle
    // as long as we need 90/-90 this is ok because proportions stay
    // angle2: resultPrev ? Math.atan2(this.result - resultPrev, 1) : null, // ask: not used for now
  }

  /*
 * Least squares linear regression fitting.
 */
  linreg(values_x, values_y) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;

    /*
     * We'll use those variables for faster read/write access.
     */
    var x = 0;
    var y = 0;
    var values_length = values_x.length;

    if (values_length != values_y.length) {
      throw new Error(
        "The parameters values_x and values_y need to have same size!"
      );
    }

    /*
     * Nothing to do.
     */
    if (values_length === 0) {
      return [[], []];
    }

    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (var v = 0; v < values_length; v++) {
      x = values_x[v];
      y = values_y[v];
      sum_x += x;
      sum_y += y;
      sum_xx += x * x;
      sum_xy += x * y;
      count++;
    }

    /*
     * Calculate m and b for the formular:
     * y = x * m + b
     */
    var m = (count * sum_xy - sum_x * sum_y) / (count * sum_xx - sum_x * sum_x);
    var b = sum_y / count - (m * sum_x) / count;

    return [m, b];
  }

  /*
 * Handle calculations
 */
  calculate() {
    // get the reg
    var reg = this.linreg(this.x, this.history);

    // y = a * x + b

    // ask: wait what? why depth not last price?
    // u = price
    // x = time
    // oh ok so time from 0 to depth/period, got it
    this.m = reg[0];
    this.b = reg[1];
    this.result = (this.depth - 1) * reg[0] + reg[1];
  }
}

module.exports = Indicator;
