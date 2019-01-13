import { XmBase, VWAP as _VWAP, WaveManager } from "./gekko";
import { Candle, IndSettings, VWAPValue } from "../types";
import { mapObj } from "../utils";

export type P_VWAP = "p10" | "p20" | "p30" | "p40" | "p50" | "p60";

export type IndVWAP = { [p in P_VWAP]: VWAPValue };

type Internal = { [p in P_VWAP]: any };

export class VWAP {
  ind: Internal;

  static getPS = () => Object.keys(new VWAP({} as WaveManager).ind);

  constructor(waveManager: WaveManager) {
    const settings: IndSettings = {
      p10: { period: 10 },
      p20: { period: 20 },
      p30: { period: 30 },
      p40: { period: 40 },
      p50: { period: 50 },
      p60: { period: 60 }
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _VWAP(settings.period));
  };

  update(bigCandle: Candle): IndVWAP {
    return mapObj(this.ind, (k: string) => this.ind[k as P_VWAP].update(bigCandle));
  }
}
