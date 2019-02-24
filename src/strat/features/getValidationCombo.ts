import { FeatureSplit } from "./FeatureSplit";

export const getValidationCombo = (): FeatureSplit[] => {
  return [
    {
      name: "vixFix.x120.a",
      fn: x => [x.ind.vixFix.x120.a]
    },
    {
      name: "macd.x120.sig9",
      fn: x => [x.ind.macd.x120.sig9.histo]
    },
    // {
    //   name: "vwap.x30.p40",
    //   fn: x => [x.ind.vwap.x30.p40.den]
    // },
    {
      name: "t3Macd.x120.sig2_16.histo",
      fn: x => [x.ind.t3Macd.x120.sig2_16.histo]
    },
    {
      name: "zerolagMACD.x480.sig2_16",
      fn: x => [x.ind.zerolagMACD.x480.sig2_16.histo]
    },

    {
      name: "kst.x60.p_sig3.kst",
      fn: x => [x.ind.kst.x60.p_sig3.kst]
    },

    // 0.67 the very best so far on LBL ONE
    {
      name: "macd.vixFix.vwap.t3Macd.zerolagMACD.kst",
      fn: x => [
        x.ind.vixFix.x120.a,
        x.ind.macd.x120.sig9.histo,
        // x.ind.vwap.x30.p40.den,
        x.ind.t3Macd.x120.sig2_16.histo,
        x.ind.zerolagMACD.x480.sig2_16.histo,
        x.ind.kst.x60.p_sig3.kst
      ]
    },
    {
      name: "vixFix.macd",
      fn: x => [x.ind.vixFix.x120.a, x.ind.macd.x120.sig9.histo]
    },
    {
      name: "vixFix.t3",
      fn: x => [x.ind.vixFix.x120.a, x.ind.t3Macd.x120.sig2_16.histo]
    },
    {
      name: "vixFix.zerolagMACD",
      fn: x => [x.ind.vixFix.x120.a, x.ind.zerolagMACD.x480.sig2_16.histo]
    },
    {
      name: "vixFix.kst",
      fn: x => [x.ind.vixFix.x120.a, x.ind.kst.x60.p_sig3.kst]
    },
    {
      name: "macd.t3Macd",
      fn: x => [x.ind.macd.x120.sig9.histo, x.ind.t3Macd.x120.sig2_16.histo]
    },
    {
      name: "macd.zerolagMACD",
      fn: x => [x.ind.macd.x120.sig9.histo, x.ind.zerolagMACD.x480.sig2_16.histo]
    },
    {
      name: "macd.kst",
      fn: x => [x.ind.macd.x120.sig9.histo, x.ind.kst.x60.p_sig3.kst]
    },
    {
      name: "vixFix.macd.kst",
      fn: x => [x.ind.vixFix.x120.a, x.ind.macd.x120.sig9.histo, x.ind.kst.x60.p_sig3.kst]
    }
  ];
};
