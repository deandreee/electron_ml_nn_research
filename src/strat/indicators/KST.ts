import { XmBase, KST as _KST, WaveManager } from "../gekko";
import { Candle, IndSettings } from "../types";
import { mapObj } from "../utils";

export type P_KST =
  | "p_sig3"
  | "p_sig9"
  | "p_sig3_roc5"
  | "p_sig9_roc5"
  | "p_sig3_roc15"
  | "p_sig9_roc15"
  | "p_sig3_roc5_smaroc_5"
  | "p_sig9_roc5_smaroc_5"
  | "p_sig3_roc5_smaroc_15"
  | "p_sig9_roc5_smaroc_15"
  | "p_sig3_roc15_smaroc_15"
  | "p_sig9_roc15_smaroc_15"
  | "opt";
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

  constructor(waveManager: WaveManager, opt?: object) {
    const roc5 = { ROCPer1: 5, ROCPer2: 10, ROCPer3: 15, ROCPer4: 20 };
    const roc15 = { ROCPer1: 15, ROCPer2: 20, ROCPer3: 25, ROCPer4: 30 };
    const smaroc5 = { SMAROCPer1: 5, SMAROCPer2: 5, SMAROCPer3: 5, SMAROCPer4: 5 };
    const smaroc15 = { SMAROCPer1: 15, SMAROCPer2: 15, SMAROCPer3: 15, SMAROCPer4: 20 };

    const settings: IndSettings = {
      p_sig3: { signalPeriod: 3 },
      p_sig9: { signalPeriod: 9 },
      p_sig3_roc5: { ...roc5, signalPeriod: 3 },
      p_sig9_roc5: { ...roc5, signalPeriod: 9 },
      p_sig3_roc15: { ...roc15, signalPeriod: 3 },
      p_sig9_roc15: { ...roc15, signalPeriod: 9 },
      p_sig3_roc5_smaroc_5: { ...roc5, ...smaroc5, signalPeriod: 3 },
      p_sig9_roc5_smaroc_5: { ...roc5, ...smaroc5, signalPeriod: 9 },
      p_sig3_roc5_smaroc_15: { ...roc5, ...smaroc15, signalPeriod: 3 },
      p_sig9_roc5_smaroc_15: { ...roc5, ...smaroc15, signalPeriod: 9 },
      p_sig3_roc15_smaroc_15: { ...roc15, ...smaroc15, signalPeriod: 3 },
      p_sig9_roc15_smaroc_15: { ...roc15, ...smaroc15, signalPeriod: 9 },
      opt: opt || { signalPeriod: 3 } // need something otherwise NaN feature :/
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
