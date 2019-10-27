const EMA = require("./EMA");
const IndBase = require("./IndBase");

class EMAOCC extends IndBase {
  constructor(settings, props) {
    super(props);
    this.input = "candle";
    this.emaOpen = new EMA(settings.period);
    this.emaClose = new EMA(settings.period);
  }

  updateCore(candle) {
    const open = this.emaOpen.update(candle.open);
    const close = this.emaClose.update(candle.close);
    const diff = close - open;
    return {
      open,
      close,
      diff,
    };
  }
}

module.exports = EMAOCC;
