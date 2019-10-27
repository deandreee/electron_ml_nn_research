const EMA = require("../EMA");
const LRC = require("../LRC");

// Trigger lines: Linear regression line and EMA applied to linear regression line.
// Trigger Lines
// This is a simple implementation of the trigger lines which can be used as a trend filter.
// The trigger lines are composed of a linear regression indicator (LinReg) and a signal line, which is calculated as the exponential moving average (EMA) of the linear regression line.
// When the LinReg indicator crosses above the signal line, it is considered bullish, if it crosses below, it is considered bearish.
// The indicator allows to select a color for bullish and bearish conditions and shades the area between the trigger lines.
// Default values used for the periods are 80 for the LinReg indicator and 20 for the EMA.
class TriggerLines {
  constructor(period, periodAvg) {
    this.period = period;
    this.periodAvg = periodAvg;
    this.lrc = new LRC(period);
    this.ema = new EMA(periodAvg);
  }

  update(candle) {
    this.lrc.update(candle.close);
    this.ema.update(candle.close);
    return { lrc: this.lrc.result || null, ema: this.ema.result || null };
  }
}

module.exports = TriggerLines;
