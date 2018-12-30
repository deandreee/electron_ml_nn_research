import { WaveManagers, WaveManager, BigCandles } from "./gekko";

export interface IndTimeframes<T> {
  [tf: string]: T;
  x30: T;
  x60: T;
  x120: T;
  x240: T;
  x480: T;
}

export class IndTimeframeGroup<T> {
  x30: T;
  x60: T;
  x120: T;
  x240: T;
  x480: T;

  constructor(ceetor: new (waveManager: WaveManager) => T, waveManagers: WaveManagers) {
    this.x30 = new ceetor(waveManagers.x30);
    this.x60 = new ceetor(waveManagers.x60);
    this.x120 = new ceetor(waveManagers.x120);
    this.x240 = new ceetor(waveManagers.x240);
    this.x480 = new ceetor(waveManagers.x480);
  }

  update(bigCandles: BigCandles) {
    return {
      x30: (this.x30 as any).update(bigCandles.x30),
      x60: (this.x60 as any).update(bigCandles.x60),
      x120: (this.x120 as any).update(bigCandles.x120),
      x240: (this.x240 as any).update(bigCandles.x240),
      x480: (this.x480 as any).update(bigCandles.x480)
    };
  }
}
