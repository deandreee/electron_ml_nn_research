import { Coins, Candle } from "../../types";
import { queryCandlesBatched, calcIndicators } from "../../run/queryCorrCandlesMonths";
import * as features from "../../features";
import * as daterange from "../../daterange";
import { CorrCandles } from "../../corr/CorrCandles";
import { BatchConfig } from "../../corr/BatchConfig";
import { getRunConfig } from "../testUtils";

const ranges = [daterange.Dec];
const featuresSplit = features.getSMA();
const runConfig = getRunConfig(new BatchConfig(60, 1440));

const getSMA = (candle: Candle) => {
  return Math.floor(candle.ind.sma.x240.p10);
};

describe("sma | x240", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const candleMonths = queryCandlesBatched(runConfig, Coins.BTC, ranges);
    const months = calcIndicators(runConfig, candleMonths, ranges, featuresSplit);
    month = months.Dec;
  });

  test("candlesActual.length", () => {
    expect(month.candlesActual.length).toEqual(24 * 31);
  });

  test("01", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-01T00:00:00Z"), "x240");
    expect(getSMA(c1)).toEqual(4148);
  });

  test("05", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-05T00:00:00Z"), "x240");
    expect(getSMA(c1)).toEqual(3935);
  });
});
