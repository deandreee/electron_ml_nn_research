// https://github.com/anandanand84/technicalindicators/blob/066f35bcffbf9f923f45ec28525d1f2a5d063a76/src/momentum/StochasticRSI.ts

// export class StochasticRsiInput extends IndicatorInput{
//   values : number[];
//   rsiPeriod:number;
//   stochasticPeriod:number;
//   kPeriod:number;
//   dPeriod:number;
// };

// export class StochasticRSIOutput{
//   stochRSI : number
//   k:number;
//   d:number;
// };

const StochasticRSI = require("lessertechnicalindicators").StochasticRSI;
const IndBase = require("./IndBase");

class StochRSI extends IndBase {
  constructor({ period }, props) {
    super(props);
    this.input = "candle";
    this.period = period;

    this.stochRSI = new StochasticRSI({
      period,
      high: [],
      low: [],
      close: []
    });

    this.result = null;
  }

  updateCore(candle) {
    this.result = this.stochRSI.nextValue({
      high: candle.high,
      low: candle.low,
      close: candle.close
    });

    return this.result;
  }
}

module.exports = StochRSI;
