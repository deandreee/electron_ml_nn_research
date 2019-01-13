import { XmBase, ATR as _ATR, WaveManager } from "./gekko";
import { Candle, IndSettings } from "../types";
import { mapObj } from "../utils";

export type P_ATR = "p60" | "p120" | "p240" | "p360" | "p480" | "p720" | "p960" | "p1440" | "p2880";

export type IndATR = { [p in P_ATR]: number };

type Internal = { [p in P_ATR]: any };

export class ATR {
  ind: Internal;

  static getPS = () => Object.keys(new ATR({} as WaveManager).ind);

  constructor(waveManager: WaveManager) {
    const settings: IndSettings = {
      atr60: { period: 60 },
      atr120: { period: 120 },
      atr240: { period: 240 },
      atr360: { period: 360 },
      atr480: { period: 480 },
      atr720: { period: 720 },
      atr960: { period: 960 },
      atr1440: { period: 1440 },
      atr2880: { period: 2880 }
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _ATR(settings.period));
  };

  update(bigCandle: Candle): IndATR {
    return mapObj(this.ind, (k: string) => this.ind[k as P_ATR].update(bigCandle));
  }
}
