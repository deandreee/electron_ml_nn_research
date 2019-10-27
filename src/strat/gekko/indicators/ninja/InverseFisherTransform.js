const IndBase = require("../IndBase");
const RSI = require("../RSI");
const WMA = require("./WMA");

// I'm not sure what is this, all the other (Smoothed) implementations have that crazy rainbow table
// Could be that formula from youtube video?

// In statistics, hypotheses about the value of the population correlation coefficient ρ between variables X and Y of the underlying population,
// can be tested using the Fishertransformation applied to the sample correlation r.

// ok here we go
// https://www.mesasoftware.com/papers/TheInverseFisherTransform.pdf

// Vars: IFish(0);
// Value1 = .1*(RSI(Close, 5) - 50);
// Value2 = WAverage(Value1, 9);
// IFish = (ExpValue(2*Value2) - 1) / (ExpValue(2*Value2) + 1);
// Plot1(IFish, "IFish");
// Plot2(0.5, "Sell Ref");
// Plot3(-0.5, "Buy Ref");

class InverseFisherTransform extends IndBase {
  constructor({ period }, props) {
    super(props);
    this.input = "candle";
    this.result = null;
    this.rsi = new RSI({ interval: period });
    this.wma = new WMA(9); // TODO: interval?
  }

  updateCore(candle) {
    // V1.Set(0.1*(RSI(period,1)[0]-50)); // TODO: what is period,1 ???
    this.rsi.update(candle);
    const v1 = 0.1 * (this.rsi.result - 50); // convert to range [-5;5]

    // double v2=WMA(V1,9)[0]; TODO: what is V1,9 ???
    const v2 = this.wma.update(v1); // is period always 9?

    this.result = (Math.exp(2 * v2) - 1) / (Math.exp(2 * v2) + 1);
    return this.result;
  }
}

module.exports = InverseFisherTransform;
