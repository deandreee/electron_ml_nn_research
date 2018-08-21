import { times } from "lodash";
import { Candle } from "../../types";
import { CandleBatcher2 } from "./CandleBatcher2";

interface Wave {
  candles: Candle[]; // big candles, like 10m
  batcher: CandleBatcher2;
}

export class WaveManager {
  age: number;
  candleSize: number;
  waves: Wave[];

  constructor(candleSize: number) {
    this.age = -1;
    this.candleSize = candleSize;
    this.waves = [];

    times(candleSize, () => {
      this.waves.push({
        batcher: new CandleBatcher2(candleSize),
        candles: []
      });
    });
  }

  update = (candle: Candle): Candle | null => {
    ++this.age;

    // write with offset
    if (this.age < this.candleSize) {
      for (let i = 0; i < this.age; i++) {
        this.waves[i].batcher.write([candle]);
      }
    } else {
      // then just write
      for (let i = 0; i < this.candleSize; i++) {
        this.waves[i].batcher.write([candle]);
      }
    }

    // after this, it's the moment to harvest,
    // wave 1 should have enough smallCandles
    if (this.age < this.candleSize) {
      return null;
    }

    const wave = this.getCurrentWave();
    const calcCandle = wave.batcher.check();
    wave.candles.push(calcCandle);

    return calcCandle;
  };

  getCurrentWaveIdx = (): number => {
    return this.age % this.candleSize;
  };

  getCurrentWave = (): Wave => {
    const idx = this.getCurrentWaveIdx();
    return this.waves[idx];
  };
}
