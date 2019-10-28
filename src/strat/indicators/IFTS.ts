import { XmBase, InverseFisherTransformSmoothed as _IFTS, WaveManager } from "../gekko";
import { Candle } from "../types";

export interface IndIFTS {
  [sig: string]: number;
  p5: number;
  p10: number;
  p15: number;
  p20: number;
  p30: number;
}

export class IFTS {
  p5: any;
  p10: any;
  p15: any;
  p20: any;
  p30: any;

  constructor(waveManager: WaveManager) {
    this.p5 = new XmBase(waveManager, () => new _IFTS({ period: 5 }));
    this.p10 = new XmBase(waveManager, () => new _IFTS({ period: 10 }));
    this.p15 = new XmBase(waveManager, () => new _IFTS({ period: 15 }));
    this.p20 = new XmBase(waveManager, () => new _IFTS({ period: 20 }));
    this.p30 = new XmBase(waveManager, () => new _IFTS({ period: 30 }));
  }

  update(bigCandle: Candle): IndIFTS {
    return {
      p5: this.p5.update(bigCandle),
      p10: this.p10.update(bigCandle),
      p15: this.p15.update(bigCandle),
      p20: this.p20.update(bigCandle),
      p30: this.p30.update(bigCandle)
    };
  }
}
