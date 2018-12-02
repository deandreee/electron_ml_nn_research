import { FeatureSplit } from "./FeatureSplit";

export const getVWAP = (): FeatureSplit[] => {
  return [
    { name: "vwap30_10", fn: x => [x.ind.vwap30_10.den] },
    { name: "vwap30_20", fn: x => [x.ind.vwap30_20.den] },
    { name: "vwap30_30", fn: x => [x.ind.vwap30_30.den] },

    { name: "vwap60_10", fn: x => [x.ind.vwap60_10.den] },
    { name: "vwap60_20", fn: x => [x.ind.vwap60_20.den] },
    { name: "vwap60_30", fn: x => [x.ind.vwap60_30.den] },

    { name: "vwap120_10", fn: x => [x.ind.vwap120_10.den] },
    { name: "vwap120_10", fn: x => [x.ind.vwap120_10.den] },
    { name: "vwap120_30", fn: x => [x.ind.vwap120_30.den] },

    { name: "vwap240_10", fn: x => [x.ind.vwap240_10.den] },
    { name: "vwap240_20", fn: x => [x.ind.vwap240_20.den] },
    { name: "vwap240_30", fn: x => [x.ind.vwap240_30.den] }
  ];
};
