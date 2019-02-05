import { FeatureSplit, FnGetFeature } from "./FeatureSplit";
import { getAllKhaos } from "./getAllKhaos";
import { getATR } from "./getATR";
import { getBBands, getBBandsUpperLower, getBBandsVsPrice, getBBandsAndPrice } from "./getBBands";
import { getCombo } from "./getCombo";
import { getIFT } from "./getIFT";
import { getIFTS } from "./getIFTS";
import { getMACD, getMACD_HistoryHrs, getMACD_HistoryDays } from "./getMACD";
import { getMACDADX } from "./getMACDADX";
import { getMFI } from "./getMFI";
import { getRSI, getRSI_HistoryHrs, getRSI_HistoryDays } from "./getRSI";
import { getStochKD } from "./getStochKD";
import { getVWAP } from "./getVWAP";
import { getVixFix, getVixFix_HistoryHrs, getVixFix_HistoryDays } from "./getVixFix";
import { getTest } from "./getTest";
import { getEMAOCC, getEMAOCC_Price, getEMAOCC_HistoryHrs, getEMAOCC_HistoryDays } from "./getEMAOCC";
import { getT3MACD, getT3MACD_HistoryHrs, getT3MACD_HistoryDays } from "./getT3MACD";
import { getZerolagT3 } from "./getZerolagT3";
import { getLRC, getLRC_HistoryHrs, getLRC_HistoryDays } from "./getLRC";
import { getZerolagMACD } from "./getZerolagMACD";
import { getKST, getKST_Price, getKST_HistoryHrs, getKST_HistoryDays } from "./getKST";
import { getWilliamsR } from "./getWilliamsR";
import { getPSAR } from "./getPSAR";
import { getKalman, getKalman_HistoryHrs, getKalman_HistoryDays } from "./getKalman";
import { getChandelierExit } from "./getChandelierExit";
import { getKeltner } from "./getKeltner";
import { getSMA } from "./getSMA";

import { getValidation } from "./getValidation";
import { getValidationCombo } from "./getValidationCombo";
import { getValidationFive } from "./getValidationFive";

const getAllPart1 = () => {
  return [
    ...getRSI(),
    ...getRSI_HistoryHrs(),
    ...getRSI_HistoryDays(),
    ...getBBands(),
    // ...getBBandsAndPrice(); // not working, name not bbands...
    ...getMFI(),
    ...getStochKD(),
    ...getEMAOCC(),
    ...getEMAOCC_Price(),
    ...getEMAOCC_HistoryHrs(),
    ...getEMAOCC_HistoryDays(),
    ...getT3MACD(),
    ...getT3MACD_HistoryHrs(),
    ...getT3MACD_HistoryDays()
  ];
};

const getAllPart2 = () => {
  return [
    ...getZerolagT3(),
    ...getLRC(),
    ...getLRC_HistoryHrs(),
    ...getLRC_HistoryDays(),
    ...getMACD(),
    ...getMACD_HistoryHrs(),
    ...getMACD_HistoryDays(),
    ...getZerolagMACD(),
    ...getVixFix(),
    ...getVixFix_HistoryHrs(),
    ...getVixFix_HistoryDays()
  ];
};

const getAllPart3 = () => {
  return [
    ...getKST(),
    ...getKST_Price(),
    ...getKST_HistoryHrs(),
    ...getKST_HistoryDays(),
    ...getVWAP(),
    ...getWilliamsR(),
    ...getPSAR(),
    ...getKalman(),
    ...getKalman_HistoryHrs(),
    ...getKalman_HistoryDays(),
    ...getChandelierExit(),
    ...getKeltner()
  ];
};

export const getByName = (names: string[]) => {
  return [...getAllPart1(), ...getAllPart2(), ...getAllPart3()].filter(x => names.indexOf(x.name) >= 0);
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
  getMACD_HistoryHrs,
  getMACD_HistoryDays,
  getMACDADX,
  getMFI,
  getRSI,
  getRSI_HistoryHrs,
  getRSI_HistoryDays,
  getStochKD,
  getVWAP,
  getVixFix,
  getVixFix_HistoryHrs,
  getVixFix_HistoryDays,
  getTest,
  getEMAOCC,
  getEMAOCC_Price,
  getEMAOCC_HistoryHrs,
  getEMAOCC_HistoryDays,
  getT3MACD,
  getT3MACD_HistoryHrs,
  getT3MACD_HistoryDays,
  getZerolagT3,
  getLRC,
  getLRC_HistoryHrs,
  getLRC_HistoryDays,
  getZerolagMACD,
  getKST,
  getKST_Price,
  getKST_HistoryHrs,
  getKST_HistoryDays,
  getWilliamsR,
  getPSAR,
  getValidation,
  getValidationCombo,
  getValidationFive,
  getKalman,
  getKalman_HistoryHrs,
  getKalman_HistoryDays,
  getChandelierExit,
  getKeltner
};
