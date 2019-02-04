import { Coins, Candle } from "../../types";
import { queryCandlesBatched, calcIndicators } from "../../run/queryCorrCandlesMonths";
import * as features from "../../features";
import * as daterange from "../../daterange";
import { CorrCandles } from "../../corr/CorrCandles";
import { BatchConfig } from "../../corr/BatchConfig";
import { getRunConfig } from "../testUtils";

const ranges = [daterange.Dec];
const featuresSplit = features.getMFI();
const runConfig = getRunConfig(new BatchConfig(60, 1440));

const getMFI = (candle: Candle) => {
  return Math.floor(candle.ind.mfi.x1440.p5);
};

describe("mfi | x1440 | p5", () => {
  let month: CorrCandles = null;

  beforeAll(() => {
    const candleMonths = queryCandlesBatched(runConfig, Coins.BTC, ranges);
    const months = calcIndicators(runConfig, candleMonths, ranges, featuresSplit);
    month = months.Dec;
  });

  test("length", () => {
    expect(month.candlesActual.length).toBeGreaterThan(700);
  });

  test("1", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-11-27T00:00:00Z"), "x1440");
    expect(getMFI(c1)).toEqual(0);
  });

  test("2", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-02T00:00:00Z"), "x1440");
    expect(getMFI(c1)).toEqual(79);
  });

  test("3", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-05T00:00:00Z"), "x1440");
    expect(getMFI(c1)).toEqual(38); // 39 actually
  });

  test("4", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-20T00:00:00Z"), "x1440");
    expect(getMFI(c1)).toEqual(100);
  });

  test("5", () => {
    const c1 = month.getCandleStartsAt(new Date("2018-12-29T00:00:00Z"), "x1440");
    expect(getMFI(c1)).toEqual(19); // 20 actually
  });
});
