const EMA = require("../EMA");

// https://github.com/roonius/TradingStudies/blob/master/NTBase/Indicator/%40T3.cs
// https://www.tradingtechnologies.com/help/x-study/technical-indicator-definitions/t3-t3/
class T3_Alt {
  constructor(period) {
    this.period = period;
    this.ema1 = new EMA(period);
    this.ema2 = new EMA(period);
    this.ema3 = new EMA(period);
    this.ema4 = new EMA(period);
    this.ema5 = new EMA(period);
    this.ema6 = new EMA(period);
    this.vFactor = 0.7;
  }

  // FORMULA
  // The Triple Exponential Moving Average (T3)
  // of time series 't' is:

  // EMA1 = EMA(x,Period)

  // EMA2 = EMA(EMA1,Period)

  // GD = EMA1*(1+vFactor)) - (EMA2*vFactor)

  // T3 = GD (GD ( GD(t, Period, vFactor), Period,
  // vFactor), Period, vFactor);

  // T3 = GD (GD ( GD(t)));

  // Where vFactor
  // is a volume factor between 0 and 1 which determines how the moving
  // averages responds. A value of 0 returns an EMA. A value of 1 returns
  // DEMA. Tim Tillson advised or preferred a value of 0.7.

  update(candle) {
    this.ema1.update(candle.close);
    this.ema2.update(this.ema1.result);
    const gd1 = this.calculateGD(this.ema1.result, this.ema2.result);
    this.ema3.update(gd1);
    this.ema4.update(this.ema3.result);
    const gd2 = this.calculateGD(this.ema3.result, this.ema4.result);
    this.ema5.update(gd2);
    this.ema6.update(this.ema5.result);
    const gd3 = this.calculateGD(this.ema5.result, this.ema6.result);
    this.result = gd3;
    return gd3;
  }

  // ninjatrader formula: output.Set((EMA(input, Period)[0] * (1 + VFactor)) - (EMA(EMA(input, Period), Period)[0] * VFactor));
  calculateGD(e1, e2) {
    return e1 * (1 + this.vFactor) - e2 * this.vFactor;
  }
}

module.exports = T3_Alt;
