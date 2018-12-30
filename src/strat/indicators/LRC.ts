import { XmBase, LRC as _LRC, WaveManager } from "./gekko";
import { Candle } from "../types";

export interface IndLRC {
  [p: string]: number;
  p5?: number;
  p10?: number;
  p20?: number;
  p30?: number;
  p45?: number;
  p60?: number;
}

export class LRC {
  p5: any;
  p10: any;
  p20: any;
  p30: any;
  p45: any;
  p60: any;

  constructor(waveManager: WaveManager) {
    this.p5 = new XmBase(waveManager, () => new _LRC(5));
    this.p10 = new XmBase(waveManager, () => new _LRC(10));
    this.p20 = new XmBase(waveManager, () => new _LRC(20));
    this.p30 = new XmBase(waveManager, () => new _LRC(30));
    this.p45 = new XmBase(waveManager, () => new _LRC(45));
    this.p60 = new XmBase(waveManager, () => new _LRC(60));
  }

  update(bigCandle: Candle): IndLRC {
    return {
      p5: this.p5.update(bigCandle.close),
      p10: this.p10.update(bigCandle.close),
      p20: this.p20.update(bigCandle.close),
      p30: this.p30.update(bigCandle.close),
      p45: this.p45.update(bigCandle.close),
      p60: this.p60.update(bigCandle.close)
    };
  }
}
