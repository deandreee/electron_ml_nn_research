import { XmBase, MACD as _MACD, WaveManager } from "./gekko";
import { Candle, MACDValue, IndSettings } from "../types";
import { mapObj } from "../utils";

export type P_MACD = "sig5" | "sig9" | "sig2_10" | "sig2_16" | "opt";

export type IndMACD = { [p in P_MACD]: MACDValue };

type Internal = { [p in P_MACD]: any };

export class MACD {
  ind: Internal;

  static getPS = () => Object.keys(new MACD({} as WaveManager, {}).ind);

  constructor(waveManager: WaveManager, opt: object) {
    // from here: https://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:moving_average_convergence_divergence_macd
    // http://etfhq.com/blog/2013/02/26/macd-test-results/
    const settings: IndSettings = {
      sig5: { short: 5, long: 35, signal: 5 },
      sig9: { short: 12, long: 26, signal: 9 },
      sig2_10: { short: 10, long: 60, signal: 2 },
      sig2_16: { short: 16, long: 97, signal: 2 },
      opt
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _MACD(settings));
  };

  update(bigCandle: Candle): IndMACD {
    return mapObj(this.ind, (k: string) => this.ind[k as P_MACD].update(bigCandle.close));
  }
}
