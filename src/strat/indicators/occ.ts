import { XmBase, EMA, WaveManagers, BigCandles } from "./gekko";

export interface IndEMAxOCC {
  emaOpen240_5?: number;
  emaClose240_5?: number;
  emaOCC240_5?: number;

  emaOpen240_10?: number;
  emaClose240_10?: number;
  emaOCC240_10?: number;

  emaOpen240_20?: number;
  emaClose240_20?: number;
  emaOCC240_20?: number;

  emaOpen240_30?: number;
  emaClose240_30?: number;
  emaOCC240_30?: number;
}

export class EMAxOCC {
  emaOpen240_5: any;
  emaClose240_5: any;
  emaOpen240_10: any;
  emaClose240_10: any;
  emaOpen240_20: any;
  emaClose240_20: any;
  emaOpen240_30: any;
  emaClose240_30: any;

  constructor(waveManagers: WaveManagers) {
    this.emaOpen240_5 = new XmBase(waveManagers.x240, () => new EMA(5));
    this.emaClose240_5 = new XmBase(waveManagers.x240, () => new EMA(5));

    this.emaOpen240_10 = new XmBase(waveManagers.x240, () => new EMA(10));
    this.emaClose240_10 = new XmBase(waveManagers.x240, () => new EMA(10));

    this.emaOpen240_20 = new XmBase(waveManagers.x240, () => new EMA(20));
    this.emaClose240_20 = new XmBase(waveManagers.x240, () => new EMA(20));

    this.emaOpen240_30 = new XmBase(waveManagers.x240, () => new EMA(30));
    this.emaClose240_30 = new XmBase(waveManagers.x240, () => new EMA(30));
  }

  update(bigCandles: BigCandles): IndEMAxOCC {
    const emaOpen240_5 = this.emaOpen240_5.update(bigCandles.x240.open);
    const emaClose240_5 = this.emaClose240_5.update(bigCandles.x240.close);
    const emaOCC240_5 = emaClose240_5 - emaOpen240_5;

    const emaOpen240_10 = this.emaOpen240_10.update(bigCandles.x240.open);
    const emaClose240_10 = this.emaClose240_10.update(bigCandles.x240.close);
    const emaOCC240_10 = emaClose240_10 - emaOpen240_10;

    const emaOpen240_20 = this.emaOpen240_20.update(bigCandles.x240.open);
    const emaClose240_20 = this.emaClose240_20.update(bigCandles.x240.close);
    const emaOCC240_20 = emaClose240_20 - emaOpen240_20;

    const emaOpen240_30 = this.emaOpen240_30.update(bigCandles.x240.open);
    const emaClose240_30 = this.emaClose240_30.update(bigCandles.x240.close);
    const emaOCC240_30 = emaClose240_30 - emaOpen240_30;

    return {
      emaOpen240_5,
      emaClose240_5,
      emaOCC240_5,

      emaOpen240_10,
      emaClose240_10,
      emaOCC240_10,

      emaOpen240_20,
      emaClose240_20,
      emaOCC240_20,

      emaOpen240_30,
      emaClose240_30,
      emaOCC240_30
    };
  }
}
