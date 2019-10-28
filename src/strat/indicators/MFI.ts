import { XmBase, MFI as _MFI, WaveManager } from "../gekko";
import { Candle, IndSettings } from "../types";
import { mapObj } from "../utils";

export type P_MFI = "p5" | "p10" | "p15" | "p20" | "p30" | "p45" | "p60";

export type IndMFI = { [p in P_MFI]: number };

type Internal = { [p in P_MFI]: any };

export class MFI {
  ind: Internal;

  static getPS = () => Object.keys(new MFI({} as WaveManager).ind);

  constructor(waveManager: WaveManager) {
    const settings: IndSettings = {
      p5: { interval: 5 },
      p10: { interval: 10 },
      p15: { interval: 15 },
      p20: { interval: 20 },
      p30: { interval: 30 },
      p45: { interval: 45 },
      p60: { interval: 60 }
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _MFI(settings.interval));
  };

  update(bigCandle: Candle): IndMFI {
    return mapObj(this.ind, (k: string) => this.ind[k as P_MFI].update(bigCandle));
  }
}
