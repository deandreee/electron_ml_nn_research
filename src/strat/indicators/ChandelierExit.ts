import { XmBase, ChandelierExit as _ChandelierExit, WaveManager } from "./gekko";
import { Candle } from "../types";

export interface ChandelierExitValue {
  exitLong: number;
  exitShort: number;
}

export interface IndChandelierExit {
  [p: string]: ChandelierExitValue;

  // p5_1: ChandelierExitValue;
  // p5_2: ChandelierExitValue;
  // p5_3: ChandelierExitValue;

  // p10_1: ChandelierExitValue;
  // p10_2: ChandelierExitValue;
  // p10_3: ChandelierExitValue;

  // p15_1: ChandelierExitValue;
  // p15_2: ChandelierExitValue;
  // p15_3: ChandelierExitValue;

  p20_1: ChandelierExitValue;
  p20_2: ChandelierExitValue;
  p20_3: ChandelierExitValue;

  // p25_1: ChandelierExitValue;
  // p25_2: ChandelierExitValue;
  // p25_3: ChandelierExitValue;

  // p30_1: ChandelierExitValue;
  // p30_2: ChandelierExitValue;
  // p30_3: ChandelierExitValue;
}

export class ChandelierExit {
  p5_1: any;
  p5_2: any;
  p5_3: any;

  p10_1: any;
  p10_2: any;
  p10_3: any;

  p15_1: any;
  p15_2: any;
  p15_3: any;

  p20_1: any;
  p20_2: any;
  p20_3: any;

  p25_1: any;
  p25_2: any;
  p25_3: any;

  p30_1: any;
  p30_2: any;
  p30_3: any;

  // https://github.com/anandanand84/technicalindicators/blob/master/src/volatility/ChandelierExit.ts

  constructor(waveManager: WaveManager) {
    this.p5_1 = new XmBase(waveManager, () => new _ChandelierExit({ period: 5, multiplier: 1 }));
    this.p5_2 = new XmBase(waveManager, () => new _ChandelierExit({ period: 5, multiplier: 2 }));
    this.p5_3 = new XmBase(waveManager, () => new _ChandelierExit({ period: 5, multiplier: 3 }));

    this.p10_1 = new XmBase(waveManager, () => new _ChandelierExit({ period: 10, multiplier: 1 }));
    this.p10_2 = new XmBase(waveManager, () => new _ChandelierExit({ period: 10, multiplier: 2 }));
    this.p10_3 = new XmBase(waveManager, () => new _ChandelierExit({ period: 10, multiplier: 3 }));

    this.p15_1 = new XmBase(waveManager, () => new _ChandelierExit({ period: 15, multiplier: 1 }));
    this.p15_2 = new XmBase(waveManager, () => new _ChandelierExit({ period: 15, multiplier: 2 }));
    this.p15_3 = new XmBase(waveManager, () => new _ChandelierExit({ period: 15, multiplier: 3 }));

    this.p20_1 = new XmBase(waveManager, () => new _ChandelierExit({ period: 20, multiplier: 1 }));
    this.p20_2 = new XmBase(waveManager, () => new _ChandelierExit({ period: 20, multiplier: 2 }));
    this.p20_3 = new XmBase(waveManager, () => new _ChandelierExit({ period: 20, multiplier: 3 }));

    this.p25_1 = new XmBase(waveManager, () => new _ChandelierExit({ period: 25, multiplier: 1 }));
    this.p25_2 = new XmBase(waveManager, () => new _ChandelierExit({ period: 25, multiplier: 2 }));
    this.p25_3 = new XmBase(waveManager, () => new _ChandelierExit({ period: 25, multiplier: 3 }));

    this.p30_1 = new XmBase(waveManager, () => new _ChandelierExit({ period: 30, multiplier: 1 }));
    this.p30_2 = new XmBase(waveManager, () => new _ChandelierExit({ period: 30, multiplier: 2 }));
    this.p30_3 = new XmBase(waveManager, () => new _ChandelierExit({ period: 30, multiplier: 3 }));
  }

  update(bigCandle: Candle): IndChandelierExit {
    return {
      // p5_1: this.p5_1.update(bigCandle),
      // p5_2: this.p5_2.update(bigCandle),
      // p5_3: this.p5_3.update(bigCandle),

      // p10_1: this.p10_1.update(bigCandle),
      // p10_2: this.p10_2.update(bigCandle),
      // p10_3: this.p10_3.update(bigCandle),

      // p15_1: this.p15_1.update(bigCandle),
      // p15_2: this.p15_2.update(bigCandle),
      // p15_3: this.p15_3.update(bigCandle),

      p20_1: this.p20_1.update(bigCandle),
      p20_2: this.p20_2.update(bigCandle),
      p20_3: this.p20_3.update(bigCandle)

      // p25_1: this.p25_1.update(bigCandle),
      // p25_2: this.p25_2.update(bigCandle),
      // p25_3: this.p25_3.update(bigCandle),

      // p30_1: this.p30_1.update(bigCandle),
      // p30_2: this.p30_2.update(bigCandle),
      // p30_3: this.p30_3.update(bigCandle)
    };
  }
}
