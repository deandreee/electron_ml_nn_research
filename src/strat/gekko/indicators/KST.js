const KST = require("lessertechnicalindicators").KST;
const IndBase = require("./IndBase");

// know sure thing

class Indicator extends IndBase {
  constructor(settings, props) {
    super(props);
    this.input = "candle";
    this.settings = settings;

    // https://github.com/anandanand84/technicalindicators/blob/83c81c41b925947b5d693c67b6cc07385e48e492/src/volatility/KeltnerChannels.ts
    this.ind = new KST({
      ROCPer1: this.settings.ROCPer1 || 10,
      ROCPer2: this.settings.ROCPer2 || 15,
      ROCPer3: this.settings.ROCPer3 || 20,
      ROCPer4: this.settings.ROCPer4 || 30,
      SMAROCPer1: this.settings.SMAROCPer1 || 10,
      SMAROCPer2: this.settings.SMAROCPer2 || 10,
      SMAROCPer3: this.settings.SMAROCPer3 || 10,
      SMAROCPer4: this.settings.SMAROCPer4 || 15,
      signalPeriod: this.settings.signalPeriod || 3,
      values: []
    });
  }

  // returns { kst, signal }
  updateCore(candle) {
    this.result = this.ind.nextValue(candle.close);
    return this.result;
  }
}

module.exports = Indicator;
