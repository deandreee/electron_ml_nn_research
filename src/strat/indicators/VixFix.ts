import { XmBase, VixFix as _VixFix, WaveManager } from "./gekko";
import { Candle } from "../types";

export interface IndVixFix {
  [t: string]: number;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  g: number;
  h: number;
  i: number;
}

export class VixFix {
  a: any;
  b: any;
  c: any;
  d: any;
  e: any;
  f: any;
  g: any;
  h: any;
  i: any;

  constructor(waveManager: WaveManager) {
    this.a = new XmBase(waveManager, () => new _VixFix({ pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 }));
    this.b = new XmBase(waveManager, () => new _VixFix({ pd: 25, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 }));
    this.c = new XmBase(waveManager, () => new _VixFix({ pd: 30, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 }));
    this.d = new XmBase(waveManager, () => new _VixFix({ pd: 15, bbl: 12, mult: 2.0, lb: 50, ph: 0.85 }));
    this.e = new XmBase(waveManager, () => new _VixFix({ pd: 15, bbl: 10, mult: 2.0, lb: 50, ph: 0.85 }));
    this.f = new XmBase(waveManager, () => new _VixFix({ pd: 22, bbl: 20, mult: 3.0, lb: 50, ph: 0.85 }));
    this.g = new XmBase(waveManager, () => new _VixFix({ pd: 22, bbl: 20, mult: 1.5, lb: 50, ph: 0.85 }));
    this.h = new XmBase(waveManager, () => new _VixFix({ pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.75 }));
    this.i = new XmBase(waveManager, () => new _VixFix({ pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.9 }));
  }

  update(bigCandle: Candle): IndVixFix {
    return {
      a: this.a.update(bigCandle),
      b: this.b.update(bigCandle),
      c: this.c.update(bigCandle),
      d: this.d.update(bigCandle),
      e: this.e.update(bigCandle),
      f: this.f.update(bigCandle),
      g: this.g.update(bigCandle),
      h: this.h.update(bigCandle),
      i: this.i.update(bigCandle)
    };
  }
}
