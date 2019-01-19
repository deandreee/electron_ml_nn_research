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
