import { Candle, CoinData } from "../types";
const { CandleBatcher2 } = require("../../../../gekko-develop/strategies/utils");

export const batchCandlesInXs = (coin: CoinData, batchSize: number) => {
  const batcher = new CandleBatcher2(batchSize);
  const bigCandles: Candle[] = [];
  const candles = coin.candles;

  for (let i = 0; i < candles.length; i++) {
    batcher.write(candles[i]);

    // ask: could add partial last, but gekko removes it, so let's just keep like that
    if ((i + 1) % batchSize === 0) {
      const bigCandle = batcher.check();
      bigCandles.push(bigCandle);
    }
  }

  coin.candles = bigCandles;
};
