import { XmBase, ZerolagT3 as _ZerolagT3, WaveManager } from "./gekko";
import { Candle } from "../types";

export interface IndZerolagT3 {
  p5?: number;
  p10?: number;
  p30?: number;
  p60?: number;
}

export class ZerolagT3 {
  p5: any;
  p10: any;
  p30: any;
  p60: any;

  constructor(waveManager: WaveManager) {
    this.p5 = new XmBase(waveManager, () => new _ZerolagT3(5));
    this.p10 = new XmBase(waveManager, () => new _ZerolagT3(10));
    this.p30 = new XmBase(waveManager, () => new _ZerolagT3(30));
    this.p60 = new XmBase(waveManager, () => new _ZerolagT3(60));
  }

  update(bigCandle: Candle): IndZerolagT3 {
    return {
      p5: this.p5.update(bigCandle),
      p10: this.p10.update(bigCandle),
      p30: this.p30.update(bigCandle),
      p60: this.p60.update(bigCandle)
    };
  }
}
