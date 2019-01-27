import { XmBase, StochKD as _StochKD, WaveManager } from "./gekko";
import { Candle, IndSettings, StochKDValue } from "../types";
import { mapObj } from "../utils";

export type P_StochKD = "p10" | "p14" | "p20" | "p25" | "p30";

export type IndStochKD = { [p in P_StochKD]: StochKDValue };

type Internal = { [p in P_StochKD]: any };

export class StochKD {
  ind: Internal;

  static getPS = () => Object.keys(new StochKD({} as WaveManager).ind);

  constructor(waveManager: WaveManager) {
    const settings: IndSettings = {
      p10: { period: 10, signalPeriod: 3 },
      p14: { period: 14, signalPeriod: 3 },
      p20: { period: 20, signalPeriod: 3 },
      p25: { period: 25, signalPeriod: 3 },
      p30: { period: 30, signalPeriod: 3 },
      p45: { period: 45, signalPeriod: 3 },
      p60: { period: 60, signalPeriod: 3 }
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _StochKD(settings));
  };

  update(bigCandle: Candle): IndStochKD {
    return mapObj(this.ind, (k: string) => this.ind[k as P_StochKD].update(bigCandle));
  }
}
