import { Coins, CoinData } from "../types";
import { queryCandlesBatched } from "./queryCorrCandlesMonths";
import * as daterange from "../daterange";
import { logCandleStart } from "../corr/testUtils";

const ranges = [daterange.Dec];

describe("run", () => {
  let month: CoinData = null;

  beforeAll(() => {
    const months = queryCandlesBatched(Coins.BTC, ranges);
    month = months.Dec;
  });

  // not working
  test("candlesActual.length", () => {
    const candlesPerDay = 6 * 24;

    logCandleStart(month.candles[0]);
    logCandleStart(month.candles[month.candles.length - 1]);

    expect(month.candles.length).toEqual(candlesPerDay * 31);
  });
});
