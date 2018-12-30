import { XmBase, T3MACD as _T3MACD, WaveManager } from "./gekko";
import { Candle, MACD } from "../types";

export interface IndT3MACD {
  t3Macd?: MACD;
}

export class T3MACD {
  t3Macd: any;

  constructor(waveManager: WaveManager) {
    this.t3Macd = new XmBase(waveManager, () => new _T3MACD({ short: 12, long: 26, signal: 9 }));
  }

  update(bigCandle: Candle): IndT3MACD {
    return {
      t3Macd: this.t3Macd.update(bigCandle)
    };
  }
}
