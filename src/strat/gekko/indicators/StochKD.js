const Stochastic = require("technicalindicators").Stochastic;
const IndBase = require("./IndBase");

// https://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:stochastic_oscillator_fast_slow_and_full

// CALCULATION
// Stochastics can be broken down into two lines; %K and %D.

// '''%K is the percentage of the price at closing (K) within the price range of the number of bars used in the look-back period.'''

// %K = SMA(100 * (Current Close - Lowest Low) / (Highest High - Lowest Low), smoothK)

// '''%D is a smoothed average of %K, to minimize whipsaws while remaining in the larger trend.'''

// %D = SMA(%K, periodD)

// Lowest Low = The lowest price within the number of recent bars in the look-back period (periodK input)
// Highest High = The highest price within the number of recent bars in the look-back period (periodK input)

class StochKD extends IndBase {
  constructor({ period, signalPeriod }, props) {
    super(props);
    this.input = "candle";
    this.period = period;
    this.signalPeriod = signalPeriod;

    this.stochastic = new Stochastic({
      period,
      signalPeriod,
      high: [],
      low: [],
      close: [],
    });

    this.result = null;
  }

  updateCore(candle) {
    this.result = this.stochastic.nextValue({
      high: candle.high,
      low: candle.low,
      close: candle.close,
    });

    return this.result;
  }
}

module.exports = StochKD;
