import { Candle, IndHlTrueRange } from "../../types";

export class HlTrueRange {
  candleSize: number;
  period: number;
  //   waveManager: WaveManager;
  candle_queue: Candle[];
  is_buyin: boolean;
  NoTradedSince: number;
  constructor(candleSize: number, period: number) {
    this.candleSize = candleSize;
    this.period = period;
    this.candle_queue = [];
    this.is_buyin = false;
    this.NoTradedSince = 0;

    // this.waveManager = new WaveManager(candleSize);
  }

  update = (candle: Candle): IndHlTrueRange => {
    this.candle_queue.push(candle);
    // this.waveManager.update(candle);

    if (this.candle_queue.length < this.period) {
      return {
        trueRange: null,
        valid: null,
        runningMax: null,
        runningMin: null
      };
    }

    let runningMin = this.getRunningMin();
    let runningMax = this.getRunningMax();

    const candeLow =
      candle.close < runningMin && (candle.close - runningMin) / 100;

    const c1 = this.getPrevCandle();

    const trueRange =
      Math.max(runningMax, c1.close) - Math.min(runningMin, c1.close);

    const valid = trueRange / (candle.close - c1.close);

    if (candeLow && valid > 0 && !this.is_buyin) {
      this.candle_queue = [];
      this.is_buyin = true;
    } else if (candle.close >= runningMax && this.is_buyin) {
      this.candle_queue = [];
      this.is_buyin = false;
    } else if (this.NoTradedSince > 2 && !this.is_buyin) {
      this.candle_queue = [];
      this.NoTradedSince = 0;
    }
    this.NoTradedSince++;

    return {
      trueRange,
      valid,
      runningMax: Math.max(runningMax, c1.close),
      runningMin: Math.min(runningMin, c1.close)
    };
  };

  private getRunningMax = () => {
    const barsBack = Math.min(this.candle_queue.length, this.period - 1);
    let max = 0;
    for (let i = barsBack; i > 0; i--) {
      if (this.candle_queue[i].close > max) {
        max = this.candle_queue[i].close;
      }
    }
    return max;
  };

  private getRunningMin = () => {
    const barsBack = Math.min(this.candle_queue.length, this.period - 1);
    let min = Infinity;
    for (let i = barsBack; i > 0; i--) {
      if (this.candle_queue[i].close < min) {
        min = this.candle_queue[i].close;
      }
    }
    return min;
  };

  private getPrevCandle = () => {
    return this.candle_queue[this.candle_queue.length - 2];
  };
}
