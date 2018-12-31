import { XmBase, StochKD as _StochKD, WaveManager } from "./gekko";
import { Candle, StochKDValue } from "../types";

export interface IndStochKD {
  [sig: string]: StochKDValue;
  p10: StochKDValue;
  p14: StochKDValue;
  p20: StochKDValue;
  p30: StochKDValue;
}

export class StochKD {
  p10: any;
  p14: any;
  p20: any;
  p30: any;

  constructor(waveManager: WaveManager) {
    this.p10 = new XmBase(waveManager, () => new _StochKD({ period: 10, signalPeriod: 3 }));
    this.p14 = new XmBase(waveManager, () => new _StochKD({ period: 14, signalPeriod: 3 }));
    this.p20 = new XmBase(waveManager, () => new _StochKD({ period: 20, signalPeriod: 3 }));
    this.p30 = new XmBase(waveManager, () => new _StochKD({ period: 30, signalPeriod: 3 }));
  }

  update(bigCandle: Candle): IndStochKD {
    return {
      p10: this.p10.update(bigCandle),
      p14: this.p14.update(bigCandle),
      p20: this.p20.update(bigCandle),
      p30: this.p30.update(bigCandle)
    };
  }
}
