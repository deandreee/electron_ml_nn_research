import { WaveManagers, WaveManager, BigCandles } from "./gekko";
import { ShouldCalcTF } from "../corr/utils";

export interface IndTimeframes<T> {
  [tf: string]: T;
  x30: T;
  x60: T;
  x120: T;
  x240: T;
  x1440: T;
}

export class IndTimeframeGroup<T> {
  shouldCalc: ShouldCalcTF;
  x30: T;
  x60: T;
  x120: T;
  x240: T;
  x480: T;
  x1440: T;

  constructor(
    ceetor: new (waveManager: WaveManager, opt: object) => T,
    waveManagers: WaveManagers,
    shouldCalc: ShouldCalcTF,
    opt: object
  ) {
    const { batchSize } = waveManagers;

    this.shouldCalc = shouldCalc;
    this.x30 = this.shouldCalc.x30 && batchSize <= 30 ? new ceetor(waveManagers.x30, opt) : null;
    this.x60 = this.shouldCalc.x60 && batchSize <= 60 ? new ceetor(waveManagers.x60, opt) : null;
    this.x120 = this.shouldCalc.x120 && batchSize <= 120 ? new ceetor(waveManagers.x120, opt) : null;
    this.x240 = this.shouldCalc.x240 && batchSize <= 240 ? new ceetor(waveManagers.x240, opt) : null;
    this.x480 = this.shouldCalc.x480 && batchSize <= 480 ? new ceetor(waveManagers.x480, opt) : null;
    this.x1440 = this.shouldCalc.x1440 && batchSize <= 1440 ? new ceetor(waveManagers.x1440, opt) : null;
  }

  update(bigCandles: BigCandles) {
    return {
      x30: this.x30 ? (this.x30 as any).update(bigCandles.x30) : null,
      x60: this.x60 ? (this.x60 as any).update(bigCandles.x60) : null,
      x120: this.x120 ? (this.x120 as any).update(bigCandles.x120) : null,
      x240: this.x240 ? (this.x240 as any).update(bigCandles.x240) : null,
      x480: this.x480 ? (this.x480 as any).update(bigCandles.x480) : null,
      x1440: this.x1440 ? (this.x1440 as any).update(bigCandles.x1440) : null
      // x1440: null as any
    };
  }
}
