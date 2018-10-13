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
import { getFeaturesSplit } from "./getFeatures";
// @ts-ignore
import { round2 } from "./utils";
// @ts-ignore
import { linregFX } from "./linreg";
import { LABEL_NAME } from "./mlGetLabels";
import { DateRange } from "./daterange";
import * as log from "./log";

interface Result {
  coins: CoinList;
  labelsPredicted: number[];
  linRegs: LinRegResult[];
}

export const runXG = async (): Promise<Result> => {
  // const ranges = [daterange.Jun];
  const ranges = [daterange.Jun, daterange.Jul, daterange.Aug, daterange.Sep];
  const months = queryCorrCandlesMonths(Coins.BTC, ranges);

  const featuresSplit = getFeaturesSplit();
  for (let x of featuresSplit) {
    log.start(x.name);
    const fileName = "output/temp.csv";
    // const fileName = "output/xg_7d_all_EOS.csv";
    const { booster } = await mlXG.train(months.Jun, x.fn);

    for (let range of ranges) {
      const corrCandles = months[range.name];
      const { mse, r2, evalCorr } = await mlXG.predict(booster, corrCandles, x.fn);
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
    }

    booster.free();

    log.end(x.name);
  }

  // const labelsPredicted = predictNeataptic(candlesActual);
  const labelsPredicted: number[] = [];
  const linRegs: any[] = [];

  return {
    coins: { BTC: months.Jun.coin },
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

export const runSVM = () => {
  // const { results, results3s, results5s } = await predict.predictSvm(corrCandles, x.fn);
  // await csvLogger.append("output/svm_temp.csv", range.name, "120m", x.name, { results, results3s, results5s });
  // const { labels, predicted } = await predict.predictSvmRegression(corrCandles, x.fn);
  // await csvLogPredictions.append("output/lbl_vs_pred.csv", labels, predicted);
  // const { labels, predicted } = await predict.predictNeataptic(corrCandles, x.fn);
  // await csvLogPredictions.append("output/lbl_vs_pred_neat.csv", labels, predicted);
  // const fileName = "output/svm_24h_best_2.csv";
  // const { svm, mse, r2, gamma, cost } = await predict.predictSvmRegression(corrCandles, x.fn);
  // await csvLogger.appendReg(fileName, range.name, "24h", x.name, gamma, cost, mse, r2);
  // {
  //   const { mse, r2, gamma, cost } = await predictNext(svm, dataranges.Jul, x.fn);
  //   await csvLogger.appendReg(fileName, range.name, "24h", x.name, gamma, cost, mse, r2);
  // }
  // {
  //   const { mse, r2, gamma, cost } = await predictNext(svm, dataranges.Aug, x.fn);
  //   await csvLogger.appendReg(fileName, range.name, "24h", x.name, gamma, cost, mse, r2);
  // }
  // {
  //   const { mse, r2, gamma, cost } = await predictNext(svm, dataranges.Sep, x.fn);
  //   await csvLogger.appendReg(fileName, range.name, "24h", x.name, gamma, cost, mse, r2);
  // }
  // await mlLR.predict(corrCandles, x.fn);
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

export const run = runXG;
