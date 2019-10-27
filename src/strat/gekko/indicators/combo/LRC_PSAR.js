const { XmBase, valueToOHLC } = require("../../utils");
const LRC = require("./indicators/LRC");
const PSAR_TI = require("./indicators/PSAR_TI");

// let's skip this for now I'm not sure it will help in the long run ...

class LRC_PSAR {
  constructor(waveManager, props) {
    this.ind.lrc = new XmBase(this.waveManager, () => new LRC(props.lrc));
    this.ind.lrc_PSAR = new PSAR_TI(props.psar);
  }

  update() {
    const bigCandle = this.waveManager.bigCandle;
    if (!bigCandle) {
      return;
    }

    // TODO: need to figure out resultHistory, either keep in each one or false for both and keep here ... separate objects anyway
    this.ind.lrc.update(bigCandle.close);
    this.ind.lrc_PSAR.update(valueToOHLC(this.ind.lrc.result));
  }

  // for calling at the end
  getHistory() {
    return {
      lrc: this.ind.lrc.resultHistory,
      psar: this.ind.psar.resultHistory,
    };
  }
}

module.exports = LRC_PSAR;
