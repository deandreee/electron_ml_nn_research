import { XmBase, BBANDS as _BBANDS, WaveManager } from "./gekko";
import { Candle, BBandsValue } from "../types";

export interface IndBBands {
  [p: string]: BBandsValue;
  p10_dev1: BBandsValue;
  p10_dev2: BBandsValue;
  p10_dev3: BBandsValue;
  p20_dev1: BBandsValue;
  p20_dev2: BBandsValue;
  p20_dev3: BBandsValue;
  p30_dev1: BBandsValue;
  p30_dev2: BBandsValue;
  p30_dev3: BBandsValue;
}

export class BBands {
  p10_dev1: any;
  p10_dev2: any;
  p10_dev3: any;
  p20_dev1: any;
  p20_dev2: any;
  p20_dev3: any;
  p30_dev1: any;
  p30_dev2: any;
  p30_dev3: any;

  constructor(waveManager: WaveManager) {
    this.p10_dev1 = new XmBase(waveManager, () => new _BBANDS({ TimePeriod: 10, NbDevUp: 1, NbDevDn: 1 }));
    this.p10_dev2 = new XmBase(waveManager, () => new _BBANDS({ TimePeriod: 10, NbDevUp: 2, NbDevDn: 2 }));
    this.p10_dev3 = new XmBase(waveManager, () => new _BBANDS({ TimePeriod: 10, NbDevUp: 3, NbDevDn: 3 }));

    this.p20_dev1 = new XmBase(waveManager, () => new _BBANDS({ TimePeriod: 20, NbDevUp: 1, NbDevDn: 1 }));
    this.p20_dev2 = new XmBase(waveManager, () => new _BBANDS({ TimePeriod: 20, NbDevUp: 2, NbDevDn: 2 }));
    this.p20_dev3 = new XmBase(waveManager, () => new _BBANDS({ TimePeriod: 20, NbDevUp: 3, NbDevDn: 3 }));

    this.p30_dev1 = new XmBase(waveManager, () => new _BBANDS({ TimePeriod: 30, NbDevUp: 1, NbDevDn: 1 }));
    this.p30_dev2 = new XmBase(waveManager, () => new _BBANDS({ TimePeriod: 30, NbDevUp: 2, NbDevDn: 2 }));
    this.p30_dev3 = new XmBase(waveManager, () => new _BBANDS({ TimePeriod: 30, NbDevUp: 3, NbDevDn: 3 }));
  }

  update(bigCandle: Candle): IndBBands {
    return {
      p10_dev1: this.p10_dev1.update(bigCandle.close),
      p10_dev2: this.p10_dev2.update(bigCandle.close),
      p10_dev3: this.p10_dev3.update(bigCandle.close),
      p20_dev1: this.p20_dev1.update(bigCandle.close),
      p20_dev2: this.p20_dev2.update(bigCandle.close),
      p20_dev3: this.p20_dev3.update(bigCandle.close),
      p30_dev1: this.p30_dev1.update(bigCandle.close),
      p30_dev2: this.p30_dev2.update(bigCandle.close),
      p30_dev3: this.p30_dev3.update(bigCandle.close)
    };
  }
}
