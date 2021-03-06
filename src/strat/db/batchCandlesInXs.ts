import { Candle } from "../types";
import { CandleBatcher2 } from "../gekko";

export const batchCandlesInXs = (candles: Candle[], batchSize: number) => {
  const batcher = new CandleBatcher2(batchSize);
  const bigCandles: Candle[] = [];

  for (let i = 0; i < candles.length; i++) {
    batcher.write(candles[i]);

    // ask: could add partial last, but gekko removes it, so let's just keep like that
    if ((i + 1) % batchSize === 0) {
      const bigCandle: any = batcher.check();
      bigCandles.push(bigCandle);
    }
  }

  return bigCandles;
};
