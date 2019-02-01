import { XmBase, SMA as _SMA, WaveManager } from "./gekko";
import { Candle, IndSettings } from "../types";
import { mapObj } from "../utils";

export type P_SMA = "p10";

export type IndSMA = { [p in P_SMA]: number };

type Internal = { [p in P_SMA]: any };

export class SMA {
  ind: Internal;

  static getPS = () => Object.keys(new SMA({} as WaveManager, {}).ind);

  constructor(waveManager: WaveManager, opt: object) {
    const settings: IndSettings = {
      p10: { period: 10 }
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _SMA(settings.period));
  };

  update(bigCandle: Candle): IndSMA {
    return mapObj(this.ind, (k: string) => this.ind[k as P_SMA].update(bigCandle.close));
  }
}
