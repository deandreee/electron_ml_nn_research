import { Candle } from "./types";
import { getCandlePctChange } from "./utils";
import { XmRsi } from "./strats/ind";

let warmup = 30 * 15; // min
let extended = 180; // 1h

export const featurePower = (candles: Candle[]) => {
  let xmRsi = new XmRsi(30, 15);

  let rsiDropCount = 0;
  let rsiNoDropCount = 0;

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];

    if (i < warmup || i >= candles.length - extended) {
      continue; // history warmup
    }

    candle.ind.rsi = xmRsi.update(candle);
    candle.pctChange60m = getCandlePctChange(candles, i + 60, i);

    if (candle.ind.rsi > 80) {
      if (candle.pctChange60m < -0.5) {
        rsiDropCount++;
      } else {
        rsiNoDropCount++;
      }
    }
  }

  console.log("drop vs no drop: ", rsiDropCount, rsiNoDropCount);
};
