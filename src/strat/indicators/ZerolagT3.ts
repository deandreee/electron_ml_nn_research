import { XmBase, ZerolagT3 as _ZerolagT3, WaveManager } from "./gekko";
import { Candle, IndSettings } from "../types";
import { mapObj } from "../utils";

export type P_ZerolagT3 = "p5" | "p10" | "p15" | "p20" | "p25" | "p30" | "p45" | "p60";

export type IndZerolagT3 = { [p in P_ZerolagT3]: number };

type Internal = { [p in P_ZerolagT3]: any };

export class ZerolagT3 {
  ind: Internal;

  static getPS = () => Object.keys(new ZerolagT3({} as WaveManager).ind);

  constructor(waveManager: WaveManager) {
    const settings: IndSettings = {
      p5: { period: 5 },
      p10: { period: 10 },
      p15: { period: 15 },
      p20: { period: 20 },
      p25: { period: 25 },
      p30: { period: 30 },
      p45: { period: 45 },
      p60: { period: 60 }
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _ZerolagT3(settings.period));
  };

  update(bigCandle: Candle): IndZerolagT3 {
    return mapObj(this.ind, (k: string) => this.ind[k as P_ZerolagT3].update(bigCandle));
  }
}
