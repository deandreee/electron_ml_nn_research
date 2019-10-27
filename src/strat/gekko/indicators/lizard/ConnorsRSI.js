// SKIPPING THIS FOR NOW ...
// seems to magical and /lizard version doesn't match https://www.tradingview.com/wiki/Connors_RSI_(CRSI)

// Linear regression curve
const IndBase = require("./IndBase");
const ROC = require("../ROC");
const RSI = require("../RSI");

class ConnorsRSI extends IndBase {
  constructor(periodRSI, periodRSIUpDown, periodROC, props) {
    super(props);
    this.periodRSI = periodRSI;
    this.periodRSIUpDown = periodRSIUpDown;
    this.periodROC = periodROC;
    this.input = "candle";
    this.history = [];
    this.result = null;

    this.rsi = new RSI({ interval: periodRSI });
    this.rsiUpDown = new RSI({ interval: periodRSIUpDown });
    this.roc = new ROC(periodROC);
  }

  updateCore(candle) {
    this.rsi.update(candle);
    this.roc.update(candle.close);
  }
}

module.exports = ConnorsRSI;
