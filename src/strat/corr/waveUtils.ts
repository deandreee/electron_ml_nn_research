import { WaveManager, WaveManagers, BatchWaveManager, BigCandles } from "../indicators/gekko";
import { Candle } from "../types";

export const createManagers = (batchSize: number) => {
  const waveManager10 = new BatchWaveManager(10, batchSize) as WaveManager;
  const waveManager30 = new BatchWaveManager(30, batchSize) as WaveManager;
  const waveManager60 = new BatchWaveManager(60, batchSize) as WaveManager;
  const waveManager120 = new BatchWaveManager(120, batchSize) as WaveManager;
  const waveManager240 = new BatchWaveManager(240, batchSize) as WaveManager;
  const waveManager480 = new BatchWaveManager(480, batchSize) as WaveManager;
  const waveManager1440 = new BatchWaveManager(1440, batchSize) as WaveManager;

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
  const bigCandle10 = waveManagers.x10.update(candle);
  const bigCandle30 = waveManagers.x30.update(candle);
  const bigCandle60 = waveManagers.x60.update(candle);
  const bigCandle120 = waveManagers.x120.update(candle);
  const bigCandle240 = waveManagers.x240.update(candle);
  const bigCandle480 = waveManagers.x480.update(candle);
  const bigCandle1440 = waveManagers.x1440.update(candle);

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
  if (
    !bigCandles.x10 ||
    !bigCandles.x30 ||
    !bigCandles.x60 ||
    !bigCandles.x120 ||
    !bigCandles.x240 ||
    !bigCandles.x480 ||
    !bigCandles.x1440
  ) {
    return false;
  }
  return true;
};
