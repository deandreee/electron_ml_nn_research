import { XmBase, LRC as _LRC, WaveManager } from "../gekko";
import { Candle, IndSettings } from "../types";
import { mapObj } from "../utils";

export type P_LRC = "p5" | "p10" | "p15" | "p20" | "p25" | "p30" | "p45" | "p60";

export type IndLRC = { [p in P_LRC]: number };

type Internal = { [p in P_LRC]: any };

export class LRC {
  ind: Internal;

  static getPS = () => Object.keys(new LRC({} as WaveManager, {}).ind);

  constructor(waveManager: WaveManager, opt: object) {
    const settings: IndSettings = {
      p5: { period: 5 },
      p10: { period: 10 },
      p15: { period: 15 },
      p20: { period: 20 },
      p25: { period: 25 },
      p30: { period: 30 },
      p45: { period: 45 },
      p60: { period: 60 },
      opt: opt || { period: 30 } // need something otherwise NaN feature :/
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _LRC(settings.period));
  };

  update(bigCandle: Candle): IndLRC {
    return mapObj(this.ind, (k: string) => this.ind[k as P_LRC].update(bigCandle.close));
  }
}
