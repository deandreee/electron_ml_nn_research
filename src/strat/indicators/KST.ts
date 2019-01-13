import { XmBase, KST as _KST, WaveManager } from "./gekko";
import { Candle } from "../types";

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
    this.ind = {
      p_sig3: new XmBase(waveManager, () => new _KST({ signalPeriod: 3 })),
      p_sig9: new XmBase(waveManager, () => new _KST({ signalPeriod: 9 }))
    };
  }

  update(bigCandle: Candle): IndKST {
    const res = Object.assign({}, ...Object.keys(this.ind).map(k => ({ [k]: this.ind[k as P_KST].update(bigCandle) })));
    return res;
  }
}
