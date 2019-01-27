import { XmBase, RSI as _RSI, WaveManager } from "./gekko";
import { Candle, IndSettings } from "../types";
import { mapObj } from "../utils";

export type P_RSI = "p5" | "p10" | "p15" | "p20" | "p30";

export type IndRSI = { [p in P_RSI]: number };

type Internal = { [p in P_RSI]: any };

export class RSI {
  ind: Internal;

  static getPS = () => Object.keys(new RSI({} as WaveManager).ind);

  p5: any;
  p10: any;
  p15: any;
  p20: any;
  p30: any;

  constructor(waveManager: WaveManager) {
    this.p5 = new XmBase(waveManager, () => new _RSI({ interval: 5 }));
    this.p10 = new XmBase(waveManager, () => new _RSI({ interval: 10 }));
    this.p15 = new XmBase(waveManager, () => new _RSI({ interval: 15 }));
    this.p20 = new XmBase(waveManager, () => new _RSI({ interval: 20 }));
    this.p30 = new XmBase(waveManager, () => new _RSI({ interval: 30 }));

    const settings: IndSettings = {
      p5: { interval: 5 },
      p10: { interval: 10 },
      p15: { interval: 15 },
      p20: { interval: 20 },
      p30: { interval: 30 }
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _RSI(settings));
  };

  update(bigCandle: Candle): IndRSI {
    return mapObj(this.ind, (k: string) => this.ind[k as P_RSI].update(bigCandle));
  }
}
