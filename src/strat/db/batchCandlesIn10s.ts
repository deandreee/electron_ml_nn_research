// import { CandleBatcher } from "../../utils/strats/utils/CandleBatcher2";
import { CandleBatcher2 } from "../strats/utils/CandleBatcher2";
import { Candle, CoinData } from "../types";

const CANDLE_SIZE = 10;

export const batchCandlesIn10s = (coin: CoinData) => {
  const batcher = new CandleBatcher2(CANDLE_SIZE);
  const bigCandles: Candle[] = [];
  const candles = coin.candles;

  for (let i = 0; i < candles.length; i++) {
    batcher.write([candles[i]]);

    // ask: could add partial last, but gekko removes it, so let's just keep like that
    if (i % CANDLE_SIZE === 0) {
      const bigCandle = batcher.calculate();
      bigCandles.push(bigCandle);
    }
  }

  coin.candles = bigCandles;
};
