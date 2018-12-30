import { FeatureSplit, FnGetFeature } from "./FeatureSplit";
import { getAllKhaos } from "./getAllKhaos";
import { getATR } from "./getATR";
import { getBBands } from "./getBBands";
import { getCombo } from "./getCombo";
import { getIFT } from "./getIFT";
import { getMACD } from "./getMACD";
import { getMACDADX } from "./getMACDADX";
import { getMFI } from "./getMFI";
import { getRSI } from "./getRSI";
import { getStochKD } from "./getStochKD";
import { getVWAP } from "./getVWAP";
import { getVixFix } from "./getVixFix";
import { getTest } from "./getTest";
import { getOCC } from "./getOCC";
import { getT3MACD } from "./getT3MACD";
import { getZerolagT3 } from "./getZerolagT3";

const getAll = () => {
  return [
    ...getATR(),
    ...getBBands(),
    ...getIFT(),
    ...getMACD(),
    ...getMACDADX(),
    ...getMFI(),
    ...getRSI(),
    ...getStochKD(),
    ...getVWAP(),
    ...getVixFix()
  ];
};

export {
  FeatureSplit,
  FnGetFeature,
  getAll,
  getAllKhaos,
  getATR,
  getBBands,
  getCombo,
  getIFT,
  getMACD,
  getMACDADX,
  getMFI,
  getRSI,
  getStochKD,
  getVWAP,
  getVixFix,
  getTest,
  getOCC,
  getT3MACD,
  getZerolagT3
};
