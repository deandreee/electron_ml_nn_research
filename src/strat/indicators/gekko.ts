import { Candle } from "../types";

const GEKKO = "../../../../gekko-develop/strategies";
// @ts-ignore
const { XmBase, BatchWaveManager, valueToOHLC } = require(`${GEKKO}/utils`);

const {
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
} = require(`${GEKKO}/indicators`);

const {
  InverseFisherTransform,
  InverseFisherTransformSmoothed,
  T3MACD,
  ZerolagT3
} = require(`${GEKKO}/indicators/ninja`);

const { VWAP, ZerolagMACD } = require(`${GEKKO}/indicators/lizard`);

export interface WaveManager {
  update: (candle: Candle) => Candle;
  getCurrentWaveIdx: () => number;
  age: number;
}

export interface WaveManagers {
  x10: WaveManager;
  x30: WaveManager;
  x60: WaveManager;
  x120: WaveManager;
  x240: WaveManager;
  x480: WaveManager;
  x1440: WaveManager;
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

export {
  XmBase,
  BatchWaveManager,
  valueToOHLC,
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
  InverseFisherTransform,
  InverseFisherTransformSmoothed,
  VWAP,
  ZerolagMACD,
  T3MACD,
  ZerolagT3,
  LRC,
  KeltnerChannels,
  ChandelierExit,
  KST,
  WilliamsR,
  PSAR_TI,
  PSARProps,
  Kalman,
  EMAOCC
};
