import { XmBase, ZerolagMACD as _ZerolagMACD, WaveManager } from "./gekko";
import { Candle, MACD } from "../types";

export interface IndZerolagMACD {
  [sig: string]: MACD;
  sig9?: MACD;
}

export class ZerolagMACD {
  sig9: any;

  constructor(waveManager: WaveManager) {
    this.sig9 = new XmBase(waveManager, () => new _ZerolagMACD({ short: 12, long: 26, signal: 9 }));
  }

  update(bigCandle: Candle): IndZerolagMACD {
    return {
      sig9: this.sig9.update(bigCandle)
    };
  }
}
