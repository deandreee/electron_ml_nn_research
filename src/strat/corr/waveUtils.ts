import { WaveManager, WaveManagers, BatchWaveManager, BigCandles } from "../indicators/gekko";
import { Candle } from "../types";
import { MAX_TF } from "./calcBatched";

export const createManagers = (batchSize: number) => {
  const waveManager10 = batchSize <= 10 ? (new BatchWaveManager(10, batchSize) as WaveManager) : undefined;
  const waveManager30 = batchSize <= 30 ? (new BatchWaveManager(30, batchSize) as WaveManager) : undefined;
  const waveManager60 = batchSize <= 60 ? (new BatchWaveManager(60, batchSize) as WaveManager) : undefined;
  const waveManager120 = batchSize <= 120 ? (new BatchWaveManager(120, batchSize) as WaveManager) : undefined;
  const waveManager240 = batchSize <= 240 ? (new BatchWaveManager(240, batchSize) as WaveManager) : undefined;
  const waveManager480 = batchSize <= 480 ? (new BatchWaveManager(480, batchSize) as WaveManager) : undefined;
  const waveManager1440 = batchSize <= 1440 ? (new BatchWaveManager(1440, batchSize) as WaveManager) : undefined;

  const waveManagers: WaveManagers = {
    x10: waveManager10,
    x30: waveManager30,
    x60: waveManager60,
    x120: waveManager120,
    x240: waveManager240,
    x480: waveManager480,
    x1440: waveManager1440
  };

  return waveManagers;
};

export const updateCandles = (waveManagers: WaveManagers, candle: Candle) => {
  const bigCandle10 = waveManagers.x10 ? waveManagers.x10.update(candle) : undefined;
  const bigCandle30 = waveManagers.x30 ? waveManagers.x30.update(candle) : undefined;
  const bigCandle60 = waveManagers.x60 ? waveManagers.x60.update(candle) : undefined;
  const bigCandle120 = waveManagers.x120 ? waveManagers.x120.update(candle) : undefined;
  const bigCandle240 = waveManagers.x240 ? waveManagers.x240.update(candle) : undefined;
  const bigCandle480 = waveManagers.x480 ? waveManagers.x480.update(candle) : undefined;
  const bigCandle1440 = waveManagers.x1440 ? waveManagers.x1440.update(candle) : undefined;

  const bigCandles: BigCandles = {
    x10: bigCandle10,
    x30: bigCandle30,
    x60: bigCandle60,
    x120: bigCandle120,
    x240: bigCandle240,
    x480: bigCandle480,
    x1440: bigCandle1440
  };

  return bigCandles;
};

export const areCandlesReady = (bigCandles: BigCandles) => {
  if (!bigCandles[`x${MAX_TF}`]) {
    return false;
  }

  return true;
};
