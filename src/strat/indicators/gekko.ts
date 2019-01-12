import { Candle } from "../types";

const GEKKO = "../../../../gekko-develop/strategies";
// @ts-ignore
const { XmBase, BatchWaveManager, valueToOHLC } = require(`${GEKKO}/utils`);

const { MACD, RSI, BBands, MFI, StochKD, ADX, ATR, VixFix, EMA, LRC, KeltnerChannels } = require(`${GEKKO}/indicators`);

const {
  InverseFisherTransform,
  InverseFisherTransformSmoothed,
  T3MACD,
  ZerolagT3
} = require(`${GEKKO}/indicators/ninja`);

const { VWAP, ZerolagMACD } = require(`${GEKKO}/indicators/lizard`);

export interface WaveManager {
  update: (candle: Candle) => Candle;
}

export interface WaveManagers {
  x10: WaveManager;
  x30: WaveManager;
  x60: WaveManager;
  x120: WaveManager;
  x240: WaveManager;
  x480: WaveManager;
}

export interface BigCandles {
  x10: Candle;
  x30: Candle;
  x60: Candle;
  x120: Candle;
  x240: Candle;
  x480: Candle;
}

export {
  XmBase,
  BatchWaveManager,
  valueToOHLC,
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
  KeltnerChannels
};
