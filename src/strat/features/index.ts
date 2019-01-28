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
import { getVixFix } from "./getVixFix";
import { getTest } from "./getTest";
import { getEMAOCC, getEMAOCC_Price, getEMAOCC_History } from "./getEMAOCC";
import { getT3MACD } from "./getT3MACD";
import { getZerolagT3 } from "./getZerolagT3";
import { getLRC } from "./getLRC";
import { getZerolagMACD } from "./getZerolagMACD";
import { getKST, getKSTandPrice } from "./getKST";
import { getWilliamsR } from "./getWilliamsR";
import { getPSAR } from "./getPSAR";
import { getKalman, getKalmanDiff } from "./getKalman";
import { getChandelierExit } from "./getChandelierExit";
import { getKeltner } from "./getKeltner";

import { getValidation } from "./getValidation";
import { getValidationCombo } from "./getValidationCombo";
import { getValidationFive } from "./getValidationFive";

const getAll = () => {
  return [
    ...getATR(),
    ...getBBands(),
    ...getBBandsVsPrice(),
    ...getMACD(),
    ...getMACDADX(),
    ...getMFI(),
    ...getRSI(),
    ...getStochKD(),
    ...getVWAP(),
    ...getVixFix(),
    ...getEMAOCC(),
    ...getT3MACD(),
    ...getZerolagT3(),
    ...getLRC(),
    ...getZerolagMACD()
  ];
};

export {
  FeatureSplit,
  FnGetFeature,
  getAll,
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
  getTest,
  getEMAOCC,
  getEMAOCC_Price,
  getEMAOCC_History,
  getT3MACD,
  getZerolagT3,
  getLRC,
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
