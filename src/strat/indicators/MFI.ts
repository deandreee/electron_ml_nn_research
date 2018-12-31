import { XmBase, MFI as _MFI, WaveManager } from "./gekko";
import { Candle } from "../types";

export interface IndMFI {
  [p: string]: number;
  p5: number;
  p10: number;
  p15: number;
  p20: number;
  p30: number;
  p45: number;
  p60: number;
}

export class MFI {
  p5: any;
  p10: any;
  p15: any;
  p20: any;
  p30: any;
  p45: any;
  p60: any;

  constructor(waveManager: WaveManager) {
    this.p5 = new XmBase(waveManager, () => new _MFI(5));
    this.p10 = new XmBase(waveManager, () => new _MFI(10));
    this.p15 = new XmBase(waveManager, () => new _MFI(10));
    this.p20 = new XmBase(waveManager, () => new _MFI(20));
    this.p30 = new XmBase(waveManager, () => new _MFI(30));
    this.p45 = new XmBase(waveManager, () => new _MFI(45));
    this.p60 = new XmBase(waveManager, () => new _MFI(60));
  }

  update(bigCandle: Candle): IndMFI {
    return {
      p5: this.p5.update(bigCandle),
      p10: this.p10.update(bigCandle),
      p15: this.p15.update(bigCandle),
      p20: this.p20.update(bigCandle),
      p30: this.p30.update(bigCandle),
      p45: this.p45.update(bigCandle),
      p60: this.p60.update(bigCandle)
    };
  }
}
