// anandanand84/technicalindicators lib wrapper
// @link http://en.wikipedia.org/wiki/Exponential_moving_average#Exponential_moving_average
const PSAR = require("technicalindicators").PSAR;
const IndBase = require("./IndBase");

class PSAR_ extends IndBase {
  constructor({ step, max }, props) {
    super(props);
    this.input = "candle";
    this.step = step;
    this.max = max;
    this.trend = null;
    this.trendLength = 0;
    this.psar = new PSAR({
      step,
      max,
      high: [],
      low: [],
    });
  }

  updateCore(candle) {
    // @ts-ignore
    const res = this.psar.nextValue({
      // step: this.step,
      // max: this.max,
      low: candle.low,
      high: candle.high,
    });

    // this is so so bad, that lib doesn't even have it's typings right
    const result = Array.isArray(res) ? res[0] : res;

    if (this.trend === null) {
      if (result > candle.close) {
        this.result = this.newTrend(result, "down");
        return this.result;
      } else {
        this.result = this.newTrend(result, "up");
        return this.result;
      }
    }

    if (this.trend === "up" && result < candle.close) {
      this.result = this.keepTrend(result);
      return this.result;
    } else if (this.trend === "up" && result > candle.close) {
      this.result = this.newTrend(result, "down");
      return this.result;
    } else if (this.trend === "down" && result > candle.close) {
      this.result = this.keepTrend(result);
      return this.result;
    } else {
      this.result = this.newTrend(result, "up");
      return this.result;
    }
  }

  newTrend(result, trend) {
    this.trend = trend;
    this.trendLength = 1;
    return {
      result,
      trend: this.trend,
      trendLength: this.trendLength,
    };
  }

  keepTrend(result) {
    this.trendLength++;
    return {
      result,
      trend: this.trend,
      trendLength: this.trendLength,
    };
  }
}

module.exports = PSAR_;
