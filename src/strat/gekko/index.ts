import { Candle } from "../types";
// @ts-ignore
export { CandleBatcher2, XmBase, WaveManager, BatchWaveManager, valueToOHLC } from "./utils";

// @ts-ignore
export { SMA, MACD, RSI, BBands } from "./indicators";
// @ts-ignore
export { MFI, StochKD, ADX, ATR, VixFix } from "./indicators";
// @ts-ignore
export { EMA, LRC, KeltnerChannels, ChandelierExit, KST, WilliamsR } from "./indicators";
// @ts-ignore
export { PSAR_TI, PSARProps, Kalman, EMAOCC } from "./indicators";

// @ts-ignore
export { InverseFisherTransform, InverseFisherTransformSmoothed, T3MACD, ZerolagT3 } from "./indicators/ninja";

// @ts-ignore
export { VWAP, ZerolagMACD } from "./indicators/lizard";

export interface WaveManager {
  update: (candle: Candle) => Candle;
  getCurrentWaveIdx: () => number;
  age: number;
  getWaveCandles: (idx: number) => Candle[];
}

export interface WaveManagers {
  x10: WaveManager;
  x30: WaveManager;
  x60: WaveManager;
  x120: WaveManager;
  x240: WaveManager;
  x480: WaveManager;
  x1440: WaveManager;
  batchSize: number;
}

export interface BigCandles {
  [x: string]: Candle;
  x10: Candle;
  x30: Candle;
  x60: Candle;
  x120: Candle;
  x240: Candle;
  x480: Candle;
  x1440: Candle;
}
