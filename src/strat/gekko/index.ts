import { Candle } from "../types";
export { CandleBatcher2, XmBase, BatchWaveManager, valueToOHLC } from "./utils";

export {
  SMA,
  MACD,
  RSI,
  BBands,
  MFI,
  StochKD,
  ADX,
  ATR,
  VixFix,
  EMA,
  LRC,
  KeltnerChannels,
  ChandelierExit,
  KST,
  WilliamsR,
  PSAR_TI,
  PSARProps,
  Kalman,
  EMAOCC
} from "./indicators";

export { InverseFisherTransform, InverseFisherTransformSmoothed, T3MACD, ZerolagT3 } from "./indicators/ninja";

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
