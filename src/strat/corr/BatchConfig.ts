// export const MAX_TF = 1440; // was 480 prev

// // const BATCH_SIZE = 10;
// export const BATCH_SIZE = 60;
// // const BATCH_SIZE = 10;
// // const BATCH_SIZE = 240;
// // const BATCH_SIZE = 1440;
// export const WARMUP_IND = MAX_TF * 100; // => ind ready | vixFix lb 90
// export const EXTENDED = 1500 * 10; // => for pct change, not sure why 10
// export const WARMUP_IND_COUNT = WARMUP_IND / BATCH_SIZE;
// export const EXTENDED_COUNT = EXTENDED / BATCH_SIZE;

export class BatchConfig {
  batchSize: number;
  maxTF: number;
  warmupInd: number; // => ind ready
  extended: number; // => for pct change

  warmupIndCount: number;
  extendedCount: number;

  constructor(batchSize: number, maxTF: number) {
    this.batchSize = batchSize;
    this.maxTF = maxTF;
    this.warmupInd = this.maxTF * 100; // 100 because vixFix lb 90
    this.extended = 1500 * 10; // not sure why 10

    this.warmupIndCount = this.warmupInd / this.batchSize;
    this.extendedCount = this.extended / this.batchSize;
  }
}
