import { CoinList, Coins } from "./types";
import * as ms from "ms";
import { queryCoin } from "./queryCoins";
import { corrCalc, LinRegResult, WARMUP_IND, EXTENDED, CorrCandles } from "./corrCalc";

// import { corrMFI } from "./corrMFI";
// import { corrATR } from "./corrATR";
// import { corrCCI } from "./corrCCI";
// import { corrMACD } from "./corrMACD";
import * as daterange from "./daterange";
// import { corrIFTS } from "./corrIFTS";
// @ts-ignore
import * as predict from "./ml";
// @ts-ignore
import * as mlLR from "./mlLR";
// @ts-ignore
import * as mlXG from "./mlXG";

// @ts-ignore
import * as csvLog from "./csvLog";
// @ts-ignore
import * as csvLogger from "./csvLogger";
// @ts-ignore
import * as csvLogPredictions from "./csvLogPredictions";
// @ts-ignore
import { getFeaturesSplit, FeatureSplit } from "./mlGetFeatures";
// @ts-ignore
import { round2 } from "./utils";
// @ts-ignore
import { linregFX } from "./linreg";
// @ts-ignore
import { LABEL_NAME } from "./mlGetLabels";
import { DateRange } from "./daterange";
import * as log from "./log";
// @ts-ignore
import { padEnd } from "lodash";

interface Result {
  coins: CoinList;
  labelsPredicted: number[];
  linRegs: LinRegResult[];
}

export const runXG = async (): Promise<Result> => {
  // const ranges = [daterange.SepWeek];
  const ranges = [daterange.Jun, daterange.Jul, daterange.Aug, daterange.Sep];
  // const ranges = [daterange.JunJul, daterange.Aug];
  // const ranges = [daterange.JunJul, daterange.Aug, daterange.Sep, daterange.Oct];
  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug];
  const months = queryCorrCandlesMonths(Coins.BTC, ranges);
  const trainMonth = months[ranges[0].name];

  const linRegs: LinRegResult[] = [];

  const featuresSplit = getFeaturesSplit();
  for (let x of featuresSplit) {
    log.start(x.name);
    // const fileName = "output/temp.csv";
    // const fileName = "output/xg_7d_all_EOS.csv";
    // const fileName = "output/xg_7d_all_BTC_REAL.csv";
    const fileName = "output/xg_10d_rsi_BTC_REAL.csv";
    const { booster } = await mlXG.train(trainMonth, x.fn);

    for (let range of ranges) {
      const corrCandles = months[range.name];
      const { mse, r2, evalCorr, labels, predicted } = await mlXG.predict(booster, corrCandles, x.fn);
      await csvLog.append(fileName, [
        new Date().toISOString(),
        corrCandles.coin.name,
        range.name,
        LABEL_NAME,
        x.name,
        round2(mse),
        round2(r2),
        round2(evalCorr.corr),
        round2(evalCorr.r2)
      ]);

      console.log(padEnd(range.name, 10), padEnd("R2", 8), round2(r2));

      linRegs.push({
        x: labels,
        y: predicted,
        regEquation: [],
        r2,
        corr: evalCorr.corr,
        name: range.name
      });
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

export const runXG_UI = async (): Promise<Result> => {
  // const ranges = [daterange.SepWeek];
  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug, daterange.Sep];
  const ranges = [daterange.Jun, daterange.Jul, daterange.Aug];
  // const ranges = [daterange.Sep];
  const months = queryCorrCandlesMonths(Coins.BTC, ranges);
  const trainMonth = months[ranges[0].name];

  const linRegs: LinRegResult[] = [];

  const features: FeatureSplit[] = [
    // { name: "rsi_combo", fn: x => [x.ind.rsi30x10, x.ind.rsi60x10, x.ind.rsi120x10, x.ind.rsi240x10, x.ind.rsi480x10] }
    // {
    //   name: "rsi_combo_macd",
    //   fn: x => [
    //     x.ind.rsi30x10,
    //     x.ind.rsi60x10,
    //     x.ind.rsi120x10,
    //     x.ind.rsi240x10,
    //     x.ind.rsi480x10,
    //     x.ind.macd30.histo,
    //     x.ind.macd60.histo,
    //     x.ind.macd120.histo,
    //     x.ind.macd240.histo
    //   ]
    // }
    {
      name: "rsi_combo_macd_bbands",
      fn: x => [
        x.ind.rsi30x10,
        x.ind.rsi60x10,
        x.ind.rsi120x10,
        x.ind.rsi240x10,
        x.ind.rsi480x10,
        x.ind.macd30.histo,
        x.ind.macd60.histo,
        x.ind.macd120.histo,
        x.ind.macd240.histo,
        x.ind.bbands60_10_1.upper - x.ind.bbands60_10_1.lower,
        x.ind.bbands60_20_1.upper - x.ind.bbands60_20_1.lower,
        x.ind.bbands120_10_1.upper - x.ind.bbands120_10_1.lower,
        x.ind.bbands120_20_1.upper - x.ind.bbands120_20_1.lower
      ]
    }
  ];

  for (let x of features) {
    log.start(x.name);

    const { booster } = await mlXG.train(trainMonth, x.fn);

    for (let range of ranges) {
      const corrCandles = months[range.name];
      const { r2, evalCorr, labels, predicted } = await mlXG.predict(booster, corrCandles, x.fn);

      console.log(padEnd(range.name, 10), padEnd("R2", 8), round2(r2));

      linRegs.push({
        // x: features.map(x => x[0]),
        // y: labels,
        x: labels,
        y: predicted,
        regEquation: [],
        r2,
        corr: evalCorr.corr,
        name: range.name
      });
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

export const runCorr = () => {
  // const { corrCandles, pctChange } = corrCalc(coins.BTC.candles);
  // const corr = linregFX(coins.BTC.name, corrCandles.candlesActual, x => x.ind.lrc10_pred, pctChange, "lrc10_pred");
  // const corr = linregFX(coins.BTC.name, corrCandles.candlesActual, x => x.ind.atr960, pctChange, "atr960");
  // const linRegs = [corr._480m, corr._1d, corr._2d, corr._7d]
};

export const runSVM = async (): Promise<Result> => {
  const ranges = [daterange.SepWeek];
  // const ranges = [daterange.Jun, daterange.Jul, daterange.Aug, daterange.Sep];
  const months = queryCorrCandlesMonths(Coins.BTC, ranges);
  const trainMonth = months[ranges[0].name];

  const linRegs: LinRegResult[] = [];

  const featuresSplit = getFeaturesSplit();
  for (let x of featuresSplit) {
    for (let range of ranges) {
      log.start(x.name);

      const corrCandles = months[range.name];
      const { labels, predicted, r2 } = await predict.predictSvmRegression(corrCandles, x.fn);
      await csvLogPredictions.append("output/lbl_vs_pred.csv", labels, predicted);

      console.log(padEnd(range.name, 10), padEnd("R2", 8), round2(r2));

      linRegs.push({
        x: labels,
        y: predicted,
        regEquation: [],
        r2: 1,
        corr: 1,
        name: range.name
      });

      log.end(x.name);
    }
  }

  const labelsPredicted: number[] = [];
  return {
    coins: { BTC: trainMonth.coin },
    labelsPredicted,
    linRegs
  };
};

export const queryCorrCandlesMonths = (coinName: Coins, ranges: DateRange[]) => {
  const corrCandleMonths: { [range: string]: CorrCandles } = {};

  for (let range of ranges) {
    log.start(`query ${range.name}`);
    const fromExtended = new Date(range.from.getTime() - ms(`${WARMUP_IND}m`));
    const toExtended = new Date(range.to.getTime() + ms(`${EXTENDED}m`));
    const coin = queryCoin(coinName, fromExtended, toExtended);
    const { corrCandles } = corrCalc(coin);
    corrCandleMonths[range.name] = corrCandles;
    log.end(`query ${range.name}`);
  }
  return corrCandleMonths;
};

export const run = async () => {
  try {
    // return await runXG();
    return await runXG_UI();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
