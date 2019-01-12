import { XmBase, KeltnerChannels as _KeltnerChannels, WaveManager } from "./gekko";
import { Candle, UpperLowerValue } from "../types";

export interface IndKeltner {
  [p: string]: UpperLowerValue;
  p20_10_1: UpperLowerValue;
  p20_10_2: UpperLowerValue;
  p20_10_3: UpperLowerValue;
}

export class Keltner {
  p20_10_1: any;
  p20_10_2: any;
  p20_10_3: any;

  constructor(waveManager: WaveManager) {
    this.p20_10_1 = new XmBase(waveManager, () => new _KeltnerChannels({ maPeriod: 20, atrPeriod: 10, multiplier: 1 }));
    this.p20_10_2 = new XmBase(waveManager, () => new _KeltnerChannels({ maPeriod: 20, atrPeriod: 10, multiplier: 2 }));
    this.p20_10_3 = new XmBase(waveManager, () => new _KeltnerChannels({ maPeriod: 20, atrPeriod: 10, multiplier: 3 }));
  }

  update(bigCandle: Candle): IndKeltner {
    return {
      p20_10_1: this.p20_10_1.update(bigCandle),
      p20_10_2: this.p20_10_2.update(bigCandle),
      p20_10_3: this.p20_10_3.update(bigCandle)
    };
  }
}
