import { Candle, PctChange } from "../types";
import { FeatureSplit } from "../features";

export const getPctChange = (candlesActual: Candle[]) => {
  const pctChange: PctChange = {
    _10m: candlesActual.map(x => x.pctChange._10m),
    _60m: candlesActual.map(x => x.pctChange._60m),
    _120m: candlesActual.map(x => x.pctChange._120m),
    _240m: candlesActual.map(x => x.pctChange._240m),
    _480m: candlesActual.map(x => x.pctChange._480m),
    _1d: candlesActual.map(x => x.pctChange._1d),
    _2d: candlesActual.map(x => x.pctChange._2d),
    _4d: candlesActual.map(x => x.pctChange._4d),
    _7d: candlesActual.map(x => x.pctChange._7d),
    _10d: candlesActual.map(x => x.pctChange._10d)
  };
  return pctChange;
};

// let's keep boolean for now, when we wan't to go deeper, will add obj ShouldCalcP
export interface ShouldCalcTF {
  [x: string]: boolean;
  x30?: boolean;
  x60?: boolean;
  x120?: boolean;
  x240?: boolean;
  x480?: boolean;
}

export const getShouldCalc = (featuresSplit: FeatureSplit[], name: string) => {
  const shouldCalc: ShouldCalcTF = {}; // everything false by default

  for (let fs of featuresSplit) {
    const fnStr = fs.fn.toString();

    let required = "";

    if (fnStr.includes("[tf]") && fnStr.includes("[p]")) {
      required = fnStr
        .replace("(x, i, corrCandles) => ", "")
        .replace("[", "") // first
        .replace(/]$/, ""); // last
    } else {
      required = fnStr
        .replace("x => [", "")
        .replace("(x, i, corrCandles) => [", "")
        .replace("]", "");
    }

    const requiredParts = required
      .replace(/x.ind./g, "")
      .replace(/ /g, "")
      .replace(/\n/g, "")
      .split(",");

    for (let req of requiredParts) {
      if (req.includes("[tf]") && req.includes("[p]")) {
        const ind = req.slice(0, req.indexOf("[tf]"));
        if (ind === name && req.includes("[tf]") && req.includes("[p]")) {
          shouldCalc.x30 = true;
          shouldCalc.x60 = true;
          shouldCalc.x120 = true;
          shouldCalc.x240 = true;
          shouldCalc.x480 = true;
          return shouldCalc;
        }
      } else {
        const parts = req.split(".");
        const ind = parts[0];
        const tf = parts[1];

        if (ind === name) {
          shouldCalc[tf] = true;
        }
      }
    }
  }

  return shouldCalc;
};

export const shouldCalc = (featuresSplit: FeatureSplit[], name: string) => {
  if (featuresSplit[0].name.startsWith("[c]")) {
    const combos = [
      "rsi",
      "mfi",
      "stoch",
      "macd",
      "bbands",
      "bbands",
      "atr",
      "wvap",
      "zerolagMACD",
      "zerolagT3",
      "emaOCC",
      "lrc",
      "macd_adx",
      "vixFix",
      "vwap"
    ];
    return combos.indexOf(name.toLowerCase()) >= 0;
  }

  if (featuresSplit[0].name.startsWith("[csi]")) {
    const combos = ["rsi", "mfi", "stoch", "macd", "macd_adx", "bbands"];
    return combos.indexOf(name) >= 0;
  }

  const names = featuresSplit.map(x => x.name.toLowerCase());
  for (let x of names) {
    if (x.indexOf(name.toLowerCase()) >= 0) {
      return true;
    }
  }
  return false;
};
