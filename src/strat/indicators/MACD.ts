import { XmBase, MACD as _MACD, WaveManager } from "./gekko";
import { Candle, MACDValue } from "../types";

export interface IndMACD {
  [sig: string]: MACDValue;
  sig5?: MACDValue;
  sig9?: MACDValue;
  sig2_10?: MACDValue;
  sig2_16?: MACDValue;
}

export class MACD {
  sig5: any;
  sig9: any;
  sig2_10: any;
  sig2_16: any;

  constructor(waveManager: WaveManager) {
    // from here: https://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:moving_average_convergence_divergence_macd
    this.sig5 = new XmBase(waveManager, () => new _MACD({ short: 5, long: 35, signal: 5 }));
    this.sig9 = new XmBase(waveManager, () => new _MACD({ short: 12, long: 26, signal: 9 }));

    // http://etfhq.com/blog/2013/02/26/macd-test-results/
    this.sig2_10 = new XmBase(waveManager, () => new _MACD({ short: 10, long: 60, signal: 2 }));
    this.sig2_16 = new XmBase(waveManager, () => new _MACD({ short: 16, long: 97, signal: 2 }));
  }

  update(bigCandle: Candle): IndMACD {
    return {
      sig5: this.sig5.update(bigCandle.close),
      sig9: this.sig9.update(bigCandle.close),
      sig2_10: this.sig2_10.update(bigCandle.close),
      sig2_16: this.sig2_16.update(bigCandle.close)
    };
  }
}
