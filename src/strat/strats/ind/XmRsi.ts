import { RSI } from "technicalindicators";
import { times } from "lodash";
import { Candle } from "../../types";
import { WaveManager } from "../utils/WaveManager";

export class XmRsi {
  candleSize: number;
  interval: number;
  waveManager: WaveManager;

  constructor(candleSize: number, interval: number) {
    this.candleSize = candleSize;
    this.interval = interval;
    this.waveManager = new WaveManager(candleSize);
  }

  update = (candle: Candle) => {
    this.waveManager.update(candle);
    const val = this.calc();
    return val;
  };

  calc = (): number => {
    const candles = this.waveManager.getCurrentWave().candles;
    const lastXcandles = candles.slice(candles.length - this.interval - 1); // 1 extra

    let rsi = new RSI({
      period: this.interval,
      values: lastXcandles.map(x => x.close)
    });

    let res = rsi.getResult();
    return res[res.length - 1] || 0; // 0 temp solution for chart
  };
}
