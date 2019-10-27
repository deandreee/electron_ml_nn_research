const { times } = require("lodash");
const CandleBatcher2 = require("./CandleBatcher2");

class WaveManager {
  constructor(candleSize) {
    this.age = -1;
    this.candleSize = candleSize;
    this.waveCount = candleSize; // very important, will differ for Batched
    this.waves = [];

    times(candleSize, () => {
      this.waves.push({
        batcher: new CandleBatcher2(candleSize),
      });
    });
  }

  update(candle) {
    return (this.bigCandle = this.update_(candle));
  }

  update_(candle) {
    ++this.age;

    // write with offset
    if (this.age < this.candleSize) {
      for (let i = 0; i < this.age; i++) {
        this.waves[i].batcher.write(candle);
      }
    } else {
      // then just write
      for (let i = 0; i < this.candleSize; i++) {
        this.waves[i].batcher.write(candle);
      }
    }

    // after this, it's the moment to harvest,
    // wave 1 should have enough smallCandles
    if (this.age < this.candleSize) {
      return null;
    }

    const wave = this.getCurrentWave();
    const calcCandle = wave.batcher.check();

    return calcCandle;
  }

  getCurrentWaveIdx() {
    return this.age % this.candleSize;
  }

  getCurrentWave() {
    const idx = this.getCurrentWaveIdx();
    return this.waves[idx];
  }
}

module.exports = WaveManager;
