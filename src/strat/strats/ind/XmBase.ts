import { PSAR } from "technicalindicators";
import { times } from "lodash";
import { Candle } from "../../types";
import { WaveManager } from "../utils/WaveManager";

export class XmBase {
  candleSize: number;
  waveManager: WaveManager;
  indArr: any[];

  constructor(candleSize: number, indArr: any[]) {
    this.candleSize = candleSize;
    this.waveManager = new WaveManager(candleSize);
    this.indArr = indArr;

    if (indArr.length !== candleSize) {
      throw new Error("indArr.length !== candleSize");
    }
  }

  update = (smallCandle: Candle, prop?: string) => {
    const bigCandle = this.waveManager.update(smallCandle);
    if (bigCandle) {
      const idx = this.waveManager.getCurrentWaveIdx(); // should start with 0
      // @ts-ignore
      const res = this.indArr[idx].update(prop ? bigCandle[prop] : bigCandle);
      return res;
    }
  };
}
