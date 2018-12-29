import { XmBase, EMA, WaveManager } from "./gekko";
import { Candle } from "../types";

export interface IndEMAxOCC {
  emaOCC_5?: number;
  emaOCC_10?: number;
  emaOCC_20?: number;
  emaOCC_30?: number;
}

export class EMAxOCC {
  emaOpen_5: any;
  emaClose_5: any;
  emaOpen_10: any;
  emaClose_10: any;
  emaOpen_20: any;
  emaClose_20: any;
  emaOpen_30: any;
  emaClose_30: any;

  constructor(waveManager: WaveManager) {
    this.emaOpen_5 = new XmBase(waveManager, () => new EMA(5));
    this.emaClose_5 = new XmBase(waveManager, () => new EMA(5));

    this.emaOpen_10 = new XmBase(waveManager, () => new EMA(10));
    this.emaClose_10 = new XmBase(waveManager, () => new EMA(10));

    this.emaOpen_20 = new XmBase(waveManager, () => new EMA(20));
    this.emaClose_20 = new XmBase(waveManager, () => new EMA(20));

    this.emaOpen_30 = new XmBase(waveManager, () => new EMA(30));
    this.emaClose_30 = new XmBase(waveManager, () => new EMA(30));
  }

  update(bigCandle: Candle): IndEMAxOCC {
    const emaOpen_5 = this.emaOpen_5.update(bigCandle.open);
    const emaClose_5 = this.emaClose_5.update(bigCandle.close);
    const emaOCC_5 = emaClose_5 - emaOpen_5;

    const emaOpen_10 = this.emaOpen_10.update(bigCandle.open);
    const emaClose_10 = this.emaClose_10.update(bigCandle.close);
    const emaOCC_10 = emaClose_10 - emaOpen_10;

    const emaOpen_20 = this.emaOpen_20.update(bigCandle.open);
    const emaClose_20 = this.emaClose_20.update(bigCandle.close);
    const emaOCC_20 = emaClose_20 - emaOpen_20;

    const emaOpen_30 = this.emaOpen_30.update(bigCandle.open);
    const emaClose_30 = this.emaClose_30.update(bigCandle.close);
    const emaOCC_30 = emaClose_30 - emaOpen_30;

    return {
      emaOCC_5,
      emaOCC_10,
      emaOCC_20,
      emaOCC_30
    };
  }
}
