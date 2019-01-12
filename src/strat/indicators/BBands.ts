import { XmBase, BBands as _BBands, WaveManager } from "./gekko";
import { Candle, UpperLowerValue } from "../types";

export interface IndBBands {
  [p: string]: UpperLowerValue;
  p10_dev1: UpperLowerValue;
  p10_dev2: UpperLowerValue;
  p10_dev3: UpperLowerValue;
  p15_dev1: UpperLowerValue;
  p15_dev2: UpperLowerValue;
  p15_dev3: UpperLowerValue;
  p20_dev1: UpperLowerValue;
  p20_dev2: UpperLowerValue;
  p20_dev3: UpperLowerValue;
  p30_dev1: UpperLowerValue;
  p30_dev2: UpperLowerValue;
  p30_dev3: UpperLowerValue;
}

export class BBands {
  p10_dev1: any;
  p10_dev2: any;
  p10_dev3: any;
  p15_dev1: any;
  p15_dev2: any;
  p15_dev3: any;
  p20_dev1: any;
  p20_dev2: any;
  p20_dev3: any;
  p30_dev1: any;
  p30_dev2: any;
  p30_dev3: any;

  constructor(waveManager: WaveManager) {
    this.p10_dev1 = new XmBase(waveManager, () => new _BBands({ TimePeriod: 10, NbDevUp: 1, NbDevDn: 1 }));
    this.p10_dev2 = new XmBase(waveManager, () => new _BBands({ TimePeriod: 10, NbDevUp: 2, NbDevDn: 2 }));
    this.p10_dev3 = new XmBase(waveManager, () => new _BBands({ TimePeriod: 10, NbDevUp: 3, NbDevDn: 3 }));

    this.p15_dev1 = new XmBase(waveManager, () => new _BBands({ TimePeriod: 15, NbDevUp: 1, NbDevDn: 1 }));
    this.p15_dev2 = new XmBase(waveManager, () => new _BBands({ TimePeriod: 15, NbDevUp: 2, NbDevDn: 2 }));
    this.p15_dev3 = new XmBase(waveManager, () => new _BBands({ TimePeriod: 15, NbDevUp: 3, NbDevDn: 3 }));

    this.p20_dev1 = new XmBase(waveManager, () => new _BBands({ TimePeriod: 20, NbDevUp: 1, NbDevDn: 1 }));
    this.p20_dev2 = new XmBase(waveManager, () => new _BBands({ TimePeriod: 20, NbDevUp: 2, NbDevDn: 2 }));
    this.p20_dev3 = new XmBase(waveManager, () => new _BBands({ TimePeriod: 20, NbDevUp: 3, NbDevDn: 3 }));

    this.p30_dev1 = new XmBase(waveManager, () => new _BBands({ TimePeriod: 30, NbDevUp: 1, NbDevDn: 1 }));
    this.p30_dev2 = new XmBase(waveManager, () => new _BBands({ TimePeriod: 30, NbDevUp: 2, NbDevDn: 2 }));
    this.p30_dev3 = new XmBase(waveManager, () => new _BBands({ TimePeriod: 30, NbDevUp: 3, NbDevDn: 3 }));
  }

  update(bigCandle: Candle): IndBBands {
    return {
      p10_dev1: this.p10_dev1.update(bigCandle.close),
      p10_dev2: this.p10_dev2.update(bigCandle.close),
      p10_dev3: this.p10_dev3.update(bigCandle.close),
      p15_dev1: this.p15_dev1.update(bigCandle.close),
      p15_dev2: this.p15_dev2.update(bigCandle.close),
      p15_dev3: this.p15_dev3.update(bigCandle.close),
      p20_dev1: this.p20_dev1.update(bigCandle.close),
      p20_dev2: this.p20_dev2.update(bigCandle.close),
      p20_dev3: this.p20_dev3.update(bigCandle.close),
      p30_dev1: this.p30_dev1.update(bigCandle.close),
      p30_dev2: this.p30_dev2.update(bigCandle.close),
      p30_dev3: this.p30_dev3.update(bigCandle.close)
    };
  }
}
