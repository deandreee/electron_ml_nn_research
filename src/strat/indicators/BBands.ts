import { XmBase, BBands as _BBands, WaveManager } from "../gekko";
import { Candle, UpperLowerValue, IndSettings } from "../types";
import { mapObj } from "../utils";

export type P_BBands =
  | "p10_dev1"
  | "p10_dev2"
  | "p10_dev3"
  | "p15_dev1"
  | "p15_dev2"
  | "p15_dev3"
  | "p20_dev1"
  | "p20_dev2"
  | "p20_dev3"
  | "p30_dev1"
  | "p30_dev2"
  | "p30_dev3";

export type IndBBands = { [p in P_BBands]: UpperLowerValue };

type Internal = { [p in P_BBands]: any };

export class BBands {
  ind: Internal;

  static getPS = () => Object.keys(new BBands({} as WaveManager).ind);

  constructor(waveManager: WaveManager) {
    const settings: IndSettings = {
      p10_dev1: { TimePeriod: 10, NbDevUp: 1, NbDevDn: 1 },
      p10_dev2: { TimePeriod: 10, NbDevUp: 2, NbDevDn: 2 },
      p10_dev3: { TimePeriod: 10, NbDevUp: 3, NbDevDn: 3 },

      p15_dev1: { TimePeriod: 15, NbDevUp: 1, NbDevDn: 1 },
      p15_dev2: { TimePeriod: 15, NbDevUp: 2, NbDevDn: 2 },
      p15_dev3: { TimePeriod: 15, NbDevUp: 3, NbDevDn: 3 },

      p20_dev1: { TimePeriod: 20, NbDevUp: 1, NbDevDn: 1 },
      p20_dev2: { TimePeriod: 20, NbDevUp: 2, NbDevDn: 2 },
      p20_dev3: { TimePeriod: 20, NbDevUp: 3, NbDevDn: 3 },

      p30_dev1: { TimePeriod: 30, NbDevUp: 1, NbDevDn: 1 },
      p30_dev2: { TimePeriod: 30, NbDevUp: 2, NbDevDn: 2 },
      p30_dev3: { TimePeriod: 30, NbDevUp: 3, NbDevDn: 3 }
    };

    this.ind = mapObj(settings, x => this.createXm(waveManager, settings[x]));
  }

  createXm = (waveManager: WaveManager, settings: any) => {
    return new XmBase(waveManager, () => new _BBands(settings));
  };

  update(bigCandle: Candle): IndBBands {
    return mapObj(this.ind, (k: string) => this.ind[k as P_BBands].update(bigCandle.close));
  }
}
