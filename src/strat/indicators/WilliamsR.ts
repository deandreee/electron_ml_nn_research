import { XmBase, WilliamsR as _WilliamsR, WaveManager } from "./gekko";
import { Candle, IndSettings } from "../types";
import { mapObj } from "../utils";

export type P_WilliamsR = "p22" | "p25" | "p30" | "p40" | "p50";

export type IndWilliamsR = { [p in P_WilliamsR]: number };

type Internal = { [p in P_WilliamsR]: any };

export class WilliamsR {
  ind: Internal;

  static getPS = () => Object.keys(new WilliamsR({} as WaveManager).ind);

  //https://github.com/anandanand84/technicalindicators/blob/83c81c41b925947b5d693c67b6cc07385e48e492/src/volatility/KeltnerChannels.ts

  constructor(waveManager: WaveManager) {
    const settings: IndSettings = {
      // can't have less because then has NaN in data ... lol
      p22: { period: 22 },
      p25: { period: 25 },
      p30: { period: 30 },
      p40: { period: 40 },
      p50: { period: 50 }
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _WilliamsR(settings));
  };

  update(bigCandle: Candle): IndWilliamsR {
    return mapObj(this.ind, (k: string) => this.ind[k as P_WilliamsR].update(bigCandle));
  }
}
