import { Coins } from "../types";
import { queryCandlesBatched } from "./queryCorrCandlesMonths";
import * as daterange from "../daterange";
import { logCandleStart } from "../corr/testUtils";
import { BatchConfig } from "../corr/BatchConfig";

const ranges = [daterange.Dec];

describe("run", () => {
  // not working
  test.skip("candlesActual.length", () => {
    const batchConfig = new BatchConfig(60, 1440);
    const months = queryCandlesBatched(batchConfig, Coins.BTC, ranges);
    const month = months.Dec;

    const candlesPerDay = 6 * 24;

    logCandleStart(month.candles[0]);
    logCandleStart(month.candles[month.candles.length - 1]);

    expect(month.candles.length).toEqual(candlesPerDay * 31);
  });

  test("candlesActual.length", () => {
    const batchConfig1 = new BatchConfig(60, 1440);
    const month1 = queryCandlesBatched(batchConfig1, Coins.BTC, ranges).Dec;

    const batchConfig2 = new BatchConfig(120, 1440);
    const month2 = queryCandlesBatched(batchConfig2, Coins.BTC, ranges).Dec;

    expect(month1.candles.length).toEqual(month2.candles.length * 2);

    {
      const c1 = month1.candles[0];
      const c2 = month2.candles[0];
      expect(c1.start).toEqual(c2.start);
    }

    {
      const c1 = month1.candles[4];
      const c2 = month2.candles[2];
      expect(c1.start).toEqual(c2.start);
    }
  });
});
