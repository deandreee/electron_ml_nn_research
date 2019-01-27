import { XmBase, EMAOCC as _EMAOCC, WaveManager } from "./gekko";
import { Candle, IndSettings, OCCValue } from "../types";
import { mapObj } from "../utils";

export type P_EMAOCC = "p5" | "p10" | "p15" | "p20" | "p25" | "p30" | "p35" | "p40" | "opt";

export type IndEMAOCC = { [p in P_EMAOCC]: OCCValue };

type Internal = { [p in P_EMAOCC]: any };

export class EMAOCC {
  ind: Internal;

  static getPS = () => Object.keys(new EMAOCC({} as WaveManager, {}).ind);

  constructor(waveManager: WaveManager, opt: object) {
    const settings: IndSettings = {
      p5: { period: 5 },
      p10: { period: 10 },
      p15: { period: 15 },
      p20: { period: 20 },
      p25: { period: 25 },
      p30: { period: 30 },
      p35: { period: 35 },
      p40: { period: 40 },
      opt: opt || { period: 22 }
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _EMAOCC(settings));
  };

  update(bigCandle: Candle): IndEMAOCC {
    return mapObj(this.ind, (k: string) => this.ind[k as P_EMAOCC].update(bigCandle));
  }
}
