import { FeatureSplit, FnGetFeature } from "./FeatureSplit";
import { getAllKhaos } from "./getAllKhaos";
import { getATR } from "./getATR";
import { getBBands, getBBandsUpperLower, getBBandsVsPrice, getBBandsAndPrice } from "./getBBands";
import { getCombo } from "./getCombo";
import { getIFT } from "./getIFT";
import { getIFTS } from "./getIFTS";
import { getMACD } from "./getMACD";
import { getMACDADX } from "./getMACDADX";
import { getMFI } from "./getMFI";
import { getRSI } from "./getRSI";
import { getStochKD } from "./getStochKD";
import { getVWAP } from "./getVWAP";
import { getVixFix, getVixFix_HistoryHrs, getVixFix_HistoryDays } from "./getVixFix";
import { getTest } from "./getTest";
import { getEMAOCC, getEMAOCC_Price, getEMAOCC_History } from "./getEMAOCC";
import { getT3MACD } from "./getT3MACD";
import { getZerolagT3 } from "./getZerolagT3";
import { getLRC, getLRC_HistoryHrs, getLRC_HistoryDays } from "./getLRC";
import { getZerolagMACD } from "./getZerolagMACD";
import { getKST, getKSTandPrice } from "./getKST";
import { getWilliamsR } from "./getWilliamsR";
import { getPSAR } from "./getPSAR";
import { getKalman, getKalmanDiff } from "./getKalman";
import { getChandelierExit } from "./getChandelierExit";
import { getKeltner } from "./getKeltner";
import { getSMA } from "./getSMA";

import { getValidation } from "./getValidation";
import { getValidationCombo } from "./getValidationCombo";
import { getValidationFive } from "./getValidationFive";

const getAllPart1 = () => {
  return [
    ...getRSI(),
    ...getBBands(),
    // ...getBBandsAndPrice(); // not working, name not bbands...
    ...getMFI(),
    ...getStochKD(),
    ...getEMAOCC(),
    ...getEMAOCC_Price(),
    ...getEMAOCC_History(),
    ...getT3MACD()
  ];
};

const getAllPart2 = () => {
  return [
    ...getZerolagT3(),
    ...getLRC(),
    ...getLRC_HistoryHrs(),
    ...getLRC_HistoryDays(),
    ...getMACD(),
    ...getZerolagMACD(),
    ...getVixFix(),
    ...getVixFix_HistoryHrs(),
    ...getVixFix_HistoryDays()
  ];
};

const getAllPart3 = () => {
  return [
    ...getKST(),
    ...getVWAP(),
    ...getWilliamsR(),
    ...getPSAR(),
    ...getKalman(),
    ...getKalmanDiff(),
    ...getChandelierExit(),
    ...getKeltner()
  ];
};

export {
  getSMA,
  FeatureSplit,
  FnGetFeature,
  getAllPart1,
  getAllPart2,
  getAllPart3,
  getAllKhaos,
  getATR,
  getBBands,
  getBBandsUpperLower,
  getBBandsVsPrice,
  getBBandsAndPrice,
  getCombo,
  getIFT,
  getIFTS,
  getMACD,
  getMACDADX,
  getMFI,
  getRSI,
  getStochKD,
  getVWAP,
  getVixFix,
  getVixFix_HistoryHrs,
  getVixFix_HistoryDays,
  getTest,
  getEMAOCC,
  getEMAOCC_Price,
  getEMAOCC_History,
  getT3MACD,
  getZerolagT3,
  getLRC,
  getLRC_HistoryHrs,
  getLRC_HistoryDays,
  getZerolagMACD,
  getKST,
  getKSTandPrice,
  getWilliamsR,
  getPSAR,
  getValidation,
  getValidationCombo,
  getValidationFive,
  getKalman,
  getKalmanDiff,
  getChandelierExit,
  getKeltner
};
