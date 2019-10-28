import { XmBase, T3MACD as _T3MACD, WaveManager } from "../gekko";
import { Candle, MACDValue, IndSettings } from "../types";
import { mapObj } from "../utils";

export type P_T3MACD = "sig5" | "sig9" | "sig2_10" | "sig2_16";

export type IndT3MACD = { [p in P_T3MACD]: MACDValue };

type Internal = { [p in P_T3MACD]: any };

export class T3MACD {
  ind: Internal;

  static getPS = () => Object.keys(new T3MACD({} as WaveManager).ind);

  //https://github.com/anandanand84/technicalindicators/blob/83c81c41b925947b5d693c67b6cc07385e48e492/src/volatility/KeltnerChannels.ts

  constructor(waveManager: WaveManager) {
    const settings: IndSettings = {
      // can't have less because then has NaN in data ... lol
      sig5: { short: 5, long: 35, signal: 5 },
      sig9: { short: 12, long: 26, signal: 9 },
      sig2_10: { short: 10, long: 60, signal: 2 },
      sig2_16: { short: 16, long: 97, signal: 2 }
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _T3MACD(settings));
  };

  update(bigCandle: Candle): IndT3MACD {
    return mapObj(this.ind, (k: string) => this.ind[k as P_T3MACD].update(bigCandle));
  }
}
