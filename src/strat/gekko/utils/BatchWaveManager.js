const { times } = require("lodash");
const CandleBatcher2 = require("./CandleBatcher2");

class BatchWaveManager {
  // candleSize = big like 480m
  // batchSize = small perf size like 10m
  constructor(candleSize, batchSize) {
    this.age = 0;
    this.candleSize = candleSize;
    this.batchSize = batchSize;

    if (candleSize % batchSize !== 0) {
      throw new Error("candleSize % batchSize !== 0");
    }

    this.waveCount = candleSize / batchSize;

    this.waves = [];

    times(this.waveCount, () => {
      this.waves.push({
        batcher: new CandleBatcher2(this.waveCount),
      });
    });
  }

  update(candle) {
    return (this.bigCandle = this.update_(candle));
  }

  update_(candle) {
    this.age++;

    // write with offset
    if (this.age < this.waveCount) {
      for (let i = 0; i < this.age; i++) {
        this.waves[i].batcher.write(candle);
      }
    } else {
      // then just write
      for (let i = 0; i < this.waveCount; i++) {
        this.waves[i].batcher.write(candle);
      }
    }

    // after this, it's the moment to harvest,
    // wave 1 should have enough smallCandles
    if (this.age < this.waveCount) {
      // if (this.age <= this.waveCount) {
      return null;
    }

    const wave = this.getCurrentWave();
    const calcCandle = wave.batcher.check();

    return calcCandle;
  }

  getCurrentWaveIdx() {
    return this.age % this.waveCount;
    // return (this.age - 1) % this.waveCount;
    // return (this.age % this.waveCount) - 1; // not thins, because starting index is -1 ...
  }

  getCurrentWave() {
    const idx = this.getCurrentWaveIdx();
    return this.waves[idx];
  }

  getWaveCandles(idx) {
    return this.waves[idx].batcher.smallCandles;
  }
}

module.exports = BatchWaveManager;
