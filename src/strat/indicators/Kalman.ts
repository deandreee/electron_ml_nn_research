import { XmBase, Kalman as _Kalman, WaveManager } from "./gekko";
import { Candle, IndSettings } from "../types";
import { mapObj } from "../utils";

export type P_Kalman = "r001_q1" | "r001_q3" | "r001_q20" | "r001_q3_b2" | "r01_q1" | "r01_q3" | "r01_q5" | "opt";

export type IndKalman = { [p in P_Kalman]: number };

type Internal = { [p in P_Kalman]: any };

export class Kalman {
  ind: Internal;

  static getPS = () => Object.keys(new Kalman({} as WaveManager, {}).ind);

  constructor(waveManager: WaveManager, opt: object) {
    const settings: IndSettings = {
      r001_q1: { R: 0.01, Q: 1 },
      r001_q3: { R: 0.01, Q: 3 },
      r001_q20: { R: 0.01, Q: 20 },
      r001_q3_b2: { R: 0.01, Q: 3, B: 2 },
      r01_q1: { R: 0.1, Q: 1 },
      r01_q3: { R: 0.1, Q: 3 },
      r01_q5: { R: 0.1, Q: 5 },
      opt
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _Kalman(settings));
  };

  update(bigCandle: Candle): IndKalman {
    return mapObj(this.ind, (k: string) => this.ind[k as P_Kalman].update(bigCandle.close));
  }
}
