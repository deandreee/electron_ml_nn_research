import { XmBase, KeltnerChannels as _KeltnerChannels, WaveManager } from "../gekko";
import { Candle, UpperLowerValue } from "../types";

export interface IndKeltner {
  [p: string]: UpperLowerValue;
  p10_10_1: UpperLowerValue;
  p10_10_2: UpperLowerValue;
  p10_10_3: UpperLowerValue;

  p20_10_1: UpperLowerValue;
  p20_10_2: UpperLowerValue;
  p20_10_3: UpperLowerValue;

  p20_20_1: UpperLowerValue;
  p20_20_2: UpperLowerValue;
  p20_20_3: UpperLowerValue;

  p30_15_1: UpperLowerValue;
  p30_15_2: UpperLowerValue;
  p30_15_3: UpperLowerValue;
}

export class Keltner {
  p10_10_1: any;
  p10_10_2: any;
  p10_10_3: any;

  p20_10_1: any;
  p20_10_2: any;
  p20_10_3: any;

  p20_20_1: any;
  p20_20_2: any;
  p20_20_3: any;

  p30_15_1: any;
  p30_15_2: any;
  p30_15_3: any;

  //https://github.com/anandanand84/technicalindicators/blob/83c81c41b925947b5d693c67b6cc07385e48e492/src/volatility/KeltnerChannels.ts

  constructor(waveManager: WaveManager) {
    this.p10_10_1 = new XmBase(waveManager, () => new _KeltnerChannels({ maPeriod: 10, atrPeriod: 10, multiplier: 1 }));
    this.p10_10_2 = new XmBase(waveManager, () => new _KeltnerChannels({ maPeriod: 10, atrPeriod: 10, multiplier: 2 }));
    this.p10_10_3 = new XmBase(waveManager, () => new _KeltnerChannels({ maPeriod: 10, atrPeriod: 10, multiplier: 3 }));

    this.p20_10_1 = new XmBase(waveManager, () => new _KeltnerChannels({ maPeriod: 20, atrPeriod: 10, multiplier: 1 }));
    this.p20_10_2 = new XmBase(waveManager, () => new _KeltnerChannels({ maPeriod: 20, atrPeriod: 10, multiplier: 2 }));
    this.p20_10_3 = new XmBase(waveManager, () => new _KeltnerChannels({ maPeriod: 20, atrPeriod: 10, multiplier: 3 }));

    this.p20_20_1 = new XmBase(waveManager, () => new _KeltnerChannels({ maPeriod: 20, atrPeriod: 20, multiplier: 1 }));
    this.p20_20_2 = new XmBase(waveManager, () => new _KeltnerChannels({ maPeriod: 20, atrPeriod: 20, multiplier: 2 }));
    this.p20_20_3 = new XmBase(waveManager, () => new _KeltnerChannels({ maPeriod: 20, atrPeriod: 20, multiplier: 3 }));

    this.p30_15_1 = new XmBase(waveManager, () => new _KeltnerChannels({ maPeriod: 30, atrPeriod: 15, multiplier: 1 }));
    this.p30_15_2 = new XmBase(waveManager, () => new _KeltnerChannels({ maPeriod: 30, atrPeriod: 15, multiplier: 2 }));
    this.p30_15_3 = new XmBase(waveManager, () => new _KeltnerChannels({ maPeriod: 30, atrPeriod: 15, multiplier: 3 }));
  }

  update(bigCandle: Candle): IndKeltner {
    return {
      p10_10_1: this.p10_10_1.update(bigCandle),
      p10_10_2: this.p10_10_2.update(bigCandle),
      p10_10_3: this.p10_10_3.update(bigCandle),

      p20_10_1: this.p20_10_1.update(bigCandle),
      p20_10_2: this.p20_10_2.update(bigCandle),
      p20_10_3: this.p20_10_3.update(bigCandle),

      p20_20_1: this.p20_20_1.update(bigCandle),
      p20_20_2: this.p20_20_2.update(bigCandle),
      p20_20_3: this.p20_20_3.update(bigCandle),

      p30_15_1: this.p30_15_1.update(bigCandle),
      p30_15_2: this.p30_15_2.update(bigCandle),
      p30_15_3: this.p30_15_3.update(bigCandle)
    };
  }
}
