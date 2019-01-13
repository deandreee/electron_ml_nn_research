import { XmBase, KST as _KST, WaveManager } from "./gekko";
import { Candle, IndSettings } from "../types";
import { mapObj } from "../utils";

export type P_KST = "p_sig3" | "p_sig9";

export interface KSTValue {
  kst: number;
  signal: number;
}

export type IndKST = { [p in P_KST]: KSTValue };

type Internal = { [p in P_KST]: any };

export class KST {
  ind: Internal;

  static getPS = () => Object.keys(new KST({} as WaveManager).ind);

  //https://github.com/anandanand84/technicalindicators/blob/83c81c41b925947b5d693c67b6cc07385e48e492/src/volatility/KeltnerChannels.ts

  constructor(waveManager: WaveManager) {
    const settings: IndSettings = {
      p_sig3: { signalPeriod: 3 },
      p_sig9: { signalPeriod: 9 }
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _KST(settings));
  };

  update(bigCandle: Candle): IndKST {
    return mapObj(this.ind, (k: string) => this.ind[k as P_KST].update(bigCandle));
  }
}
