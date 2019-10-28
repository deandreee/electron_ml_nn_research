import { XmBase, VixFix as _VixFix, WaveManager } from "../gekko";
import { Candle, IndSettings } from "../types";
import { mapObj } from "../utils";

export type P_VixFix = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "opt";

export type IndVixFix = { [p in P_VixFix]: number };

type Internal = { [p in P_VixFix]: any };

export class VixFix {
  ind: Internal;

  static getPS = () => Object.keys(new VixFix({} as WaveManager, {}).ind);

  constructor(waveManager: WaveManager, opt: object) {
    const settings: IndSettings = {
      a: { pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 },
      b: { pd: 25, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 },
      c: { pd: 30, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 },
      d: { pd: 15, bbl: 12, mult: 2.0, lb: 50, ph: 0.85 },
      e: { pd: 15, bbl: 10, mult: 2.0, lb: 50, ph: 0.85 },
      f: { pd: 22, bbl: 20, mult: 3.0, lb: 50, ph: 0.85 },
      g: { pd: 22, bbl: 20, mult: 1.5, lb: 50, ph: 0.85 },
      h: { pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.75 },
      i: { pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.9 },
      opt: opt || { pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 }
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _VixFix(settings));
  };

  update(bigCandle: Candle): IndVixFix {
    // return mapObj(this.ind, (k: string) => this.ind[k as P_VixFix].update(bigCandle));
    return mapObj(this.ind, (k: string) => {
      let res = this.ind[k as P_VixFix].update(bigCandle);
      return res;
    });
  }
}
