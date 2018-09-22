import { Candle } from "./types";
import { getCandlePctChange } from "./utils";
import { XmRsi, XmBase, VixFix } from "./strats/ind";
import { times } from "./utils";

let warmup = 30 * 15; // min
let extended = 180; // 1h

export const featurePower = (candles: Candle[]) => {
  const xmRsi = new XmRsi(120, 15);
  const xmVixFix = new XmBase(
    10,
    times(10).map(
      x => new VixFix({ pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 })
    )
  );

  let rsiDropCount = 0;
  let rsiNoDropCount = 0;

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];

    if (i < warmup || i >= candles.length - extended) {
      continue; // history warmup
    }

    candle.ind.rsi = xmRsi.update(candle);
    candle.ind.vixFix = xmVixFix.update(candle);

    candle.pctChange60m = getCandlePctChange(candles, i + 60, i);

    if (candle.ind.rsi > 80) {
      if (candle.pctChange60m < -1) {
        rsiDropCount++;
      } else {
        rsiNoDropCount++;
      }
    }
  }

  console.log("drop vs no drop: ", rsiDropCount, rsiNoDropCount);
};
