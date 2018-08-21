import { PSAR } from "technicalindicators";
import { times } from "lodash";
import { Candle } from "../../types";
import { WaveManager } from "../utils/WaveManager";

export class XmPsar {
  candleSize: number;
  waveManager: WaveManager;

  constructor(candleSize: number) {
    this.candleSize = candleSize;
    this.waveManager = new WaveManager(candleSize);
  }

  update = (candle: Candle) => {
    this.waveManager.update(candle);
    const val = this.calcPsar();
    return val;
  };

  calcPsar = (): number => {
    const candles = this.waveManager.getCurrentWave().candles;
    const lastXcandles = candles.slice(candles.length - this.candleSize);

    let step = 0.025;
    let max = 0.05;

    let psar = new PSAR({
      step,
      max,
      high: lastXcandles.map(x => x.high),
      low: lastXcandles.map(x => x.low)
    });

    let res = psar.getResult();
    return res[res.length - 1];
  };
}
