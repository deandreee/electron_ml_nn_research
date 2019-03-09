import { Coins, RunResult } from "../types";
import { queryCorrCandlesMonthsBatched } from "./queryCorrCandlesMonths";

import * as features from "../features";
import * as runUtils from "./runUtils";
import { runConfig } from "./runConfig";
import * as RLPy from "../ml/RLPy";
import * as mlUtils from "../ml/mlUtils";
import { mlGetLabels } from "../ml/mlGetLabels";

// const ranges = runUtils.genRanges_JJASON();
const ranges = runUtils.genRanges_FastMiniTest2();

// const featuresSplit = features.getRSI();
// const featuresSplit = features.getBBands();
// const featuresSplit = features.getBBandsAndPrice(); // not working, name not bbands...
// const featuresSplit = features.getMFI();
// const featuresSplit = features.getStochKD();
// const featuresSplit = features.getEMAOCC();
// const featuresSplit = features.getEMAOCC_Price();
// const featuresSplit = features.getEMAOCC_HistoryHrs();
// const featuresSplit = features.getEMAOCC_HistoryDays();
// const featuresSplit = features.getT3MACD();
// const featuresSplit = features.getT3MACD_HistoryHrs();
// const featuresSplit = features.getT3MACD_HistoryDays();
// const featuresSplit = features.getZerolagT3();
// const featuresSplit = features.getLRC();
// const featuresSplit = features.getLRC_HistoryHrs();
// const featuresSplit = features.getLRC_HistoryDays();
// const featuresSplit = features.getMACD();
// const featuresSplit = features.getMACD_HistoryHrs();
// const featuresSplit = features.getZerolagMACD();
// const featuresSplit = features.getVixFix();
// const featuresSplit = features.getVixFix_HistoryHrs();
// const featuresSplit = features.getVixFix_HistoryDays();
// const featuresSplit = features.getKST();
// const featuresSplit = features.getVWAP();
// const featuresSplit = features.getWilliamsR();
// const featuresSplit = features.getPSAR();
// const featuresSplit = features.getKalman();
// const featuresSplit = features.getKalmanDiff();
// const featuresSplit = features.getChandelierExit();
// const featuresSplit = features.getKeltner();
// const featuresSplit = features.getVixFix();
// const featuresSplit = features.getVixFix();
// const featuresSplit = features.getVixFix();
// const featuresSplit = features.getVixFix_HistoryDays();
// const featuresSplit = features.getAllPart2();
// const featuresSplit = features.getRSI_HistoryHrs();

const featureName = "macd.vixFix.vwap.t3Macd.zerolagMACD.kst";
// const featureName = "macd.vixFix.vwap.t3Macd.zerolagMACD";
// const featureName = "emaOCC.vixFix.kst2";
// const featureName = "emaOCC.vixFix.kst2.lrc.mfi.chandelierExit.t3Macd.bbands.rsi";

// const featureName = "vixFix.x1440.b.days";
// const featureName = "vixFix.x480.a.hrs";
// const featureName = "chandelierExit.x480.p5_2";
// const featureName = "kst.x1440.p_sig3_roc5_smaroc_5.price";
// const featureName = "emaOCC.x1440.p30";
// const featureName = "psar.x60.p0_004";
// const featureName = "emaOCC.x240.p30.hrs";
// const featureName = "emaOCC.x60.p30.hrs";
// const featureName = "macd.x120.sig9.hrs";'
// const featureName = "stochKD.x120.p20";
const featuresSplit = features.getByNameSingle([featureName]);

export const runRL = async (): Promise<RunResult> => {
  const months = queryCorrCandlesMonthsBatched(runConfig, Coins.BTC, ranges, featuresSplit);

  const trainMonth = months[ranges[0].name];
  let features = trainMonth.candlesActual.map(c => [c.open, c.close, c.high, c.low, c.volume]);
  features.forEach(mlUtils.sanityCheckRow);
  let labels = mlGetLabels(trainMonth, runConfig);

  const { episodes } = await RLPy.rl(["open", "close", "high", "low", "volume"], features, labels);

  const mon = "SepWeek";
  // const mon = "JJASON";

  return {
    coin: months[mon],
    months,
    labelsPredicted: [],
    linRegs: [],
    rlEpisodes: episodes
  };
};
