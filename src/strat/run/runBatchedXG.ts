import { Coins, RunResult, LinRegResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";
import * as daterange from "../daterange";

// @ts-ignore
import * as csvLog from "../csvLog";
// @ts-ignore
import * as csvLogger from "../csvLogger";
// @ts-ignore
import * as csvLogPredictions from "../csvLogPredictions";

// @ts-ignore
import { round2 } from "../utils";
// @ts-ignore
import { linregFX } from "../linreg";
// @ts-ignore
import { LABEL_NAME } from "../mlGetLabels";
import * as log from "../log";
// @ts-ignore
import { padEnd, maxBy, minBy } from "lodash";

// @ts-ignore
import * as mlXG from "../ml/mlXG";
import * as mlXGClass from "../ml/mlXGClass";
import { getFeaturesSplit } from "../ml/mlGetFeatures";
import { CorrCandles } from "../corr/CorrCandles";

export const runBatchedXG = async (): Promise<RunResult> => {
  // const ranges = [daterange.SepWeek];
  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug, daterange.Sep];
  const ranges = [
    daterange.AugSep,
    daterange.Jun,
    daterange.Jul,
    daterange.Aug,
    daterange.Sep,
    daterange.Oct,
    daterange.Nov
  ];
  // const ranges = [daterange.JunJul, daterange.Aug];
  // const ranges = [daterange.JunJul, daterange.Aug, daterange.Sep, daterange.Oct];
  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug];
  const months = queryCorrCandlesMonthsBatched(Coins.BTC, ranges);

  const trainMonth = months[ranges[0].name];

  getIndMinMax(trainMonth);

  const linRegs: LinRegResult[] = [];

  const featuresSplit = getFeaturesSplit();
  for (let x of featuresSplit) {
    log.start(x.name);
    // const fileName = "output/temp.csv";
    // const fileName = "output/xg_7d_all_EOS.csv";
    // const fileName = "output/xg_7d_all_BTC_REAL.csv";
    // const fileName = "output/xg_10d_rsi_BTC_REAL.csv";
    const { booster } = await mlXGClass.train(trainMonth, x.fn);

    for (let range of ranges) {
      const corrCandles = months[range.name];

      // console.log(
      //   padEnd(range.name, 10),
      //   padEnd(new Date(corrCandles.candlesActual[0].start * 1000).toISOString()),
      //   padEnd(new Date(corrCandles.candlesActual[corrCandles.candlesActual.length - 1].start * 1000).toISOString())
      // );

      const { results } = await mlXGClass.predict(booster, corrCandles, x.fn);

      console.log(
        padEnd(range.name, 10),
        padEnd(round2(results.precisionTotal).toString(), 5),
        padEnd(round2(results.recallTotal).toString(), 5),
        padEnd(round2(results.fScore).toString(), 5)
      );
    }

    booster.free();

    log.end(x.name);
  }

  const labelsPredicted: number[] = [];

  return {
    coins: { BTC: trainMonth.coin },
    labelsPredicted,
    linRegs
  };
};

const getIndMinMax = (candles: CorrCandles) => {
  {
    const min = minBy(candles.candlesActual, "ind.macd30.histo");
    const max = maxBy(candles.candlesActual, "ind.macd30.histo");
    console.log(
      padEnd("macd30", 10),
      padEnd(round2(min.ind.macd30.histo).toString(), 5),
      padEnd(round2(max.ind.macd30.histo).toString(), 5)
    );
  }

  {
    const min = minBy(candles.candlesActual, "ind.macd60.histo");
    const max = maxBy(candles.candlesActual, "ind.macd60.histo");
    console.log(
      padEnd("macd60", 10),
      padEnd(round2(min.ind.macd60.histo).toString(), 5),
      padEnd(round2(max.ind.macd60.histo).toString(), 5)
    );
  }

  {
    const min = minBy(candles.candlesActual, "ind.macd120.histo");
    const max = maxBy(candles.candlesActual, "ind.macd120.histo");
    console.log(
      padEnd("macd120", 10),
      padEnd(round2(min.ind.macd120.histo).toString(), 5),
      padEnd(round2(max.ind.macd120.histo).toString(), 5)
    );
  }

  {
    const min = minBy(candles.candlesActual, "ind.macd240.histo");
    const max = maxBy(candles.candlesActual, "ind.macd240.histo");
    console.log(
      padEnd("macd240", 10),
      padEnd(round2(min.ind.macd240.histo).toString(), 5),
      padEnd(round2(max.ind.macd240.histo).toString(), 5)
    );
  }
};
