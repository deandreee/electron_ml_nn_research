import { XmBase, PSAR_TI as _PSAR, PSARProps, WaveManager } from "./gekko";
import { Candle, IndSettings } from "../types";
import { mapObj } from "../utils";

export interface PSARValue {
  result: number;
  trend: "string";
  trendLength: number;
}

export type P_PSAR =
  | "p0_001"
  | "p0_002"
  | "p0_003"
  | "p0_004"
  | "p0_005"
  | "p0_006"
  | "p0_007"
  | "p0_0001"
  | "p0_0002"
  | "p0_0003"
  | "p0_0005"
  | "p0_0008";

export type IndPSAR = { [p in P_PSAR]: PSARValue };

type Internal = { [p in P_PSAR]: any };

export class PSAR {
  ind: Internal;

  static getPS = () => Object.keys(new PSAR({} as WaveManager).ind);

  constructor(waveManager: WaveManager) {
    const settings: IndSettings = {
      p0_001: PSARProps._0_001,
      p0_002: PSARProps._0_002,
      p0_003: PSARProps._0_003,
      p0_004: PSARProps._0_004,
      p0_005: PSARProps._0_005,
      p0_006: PSARProps._0_006,
      p0_007: PSARProps._0_007,
      p0_0001: PSARProps._0_0001,
      p0_0002: PSARProps._0_0002,
      p0_0003: PSARProps._0_0003,
      p0_0005: PSARProps._0_0005,
      p0_0008: PSARProps._0_0008
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _PSAR(settings));
  };

  update(bigCandle: Candle): IndPSAR {
    return mapObj(this.ind, (k: string) => this.ind[k as P_PSAR].update(bigCandle));
  }
}
