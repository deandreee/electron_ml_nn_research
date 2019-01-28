import { FeatureSplit } from "./FeatureSplit";

// BEST for LABEL FIVE

export const getValidationFive = (): FeatureSplit[] => {
  return [
    {
      name: "rsi.x1440.p15", // 0.45
      fn: x => [x.ind.rsi.x1440.p15]
    },
    {
      name: "chandelierExit.x240.p20_2", // 0.52
      fn: x => [x.ind.chandelierExit.x240.p20_2.exitLong, x.ind.chandelierExit.x240.p20_2.exitShort]
    },
    {
      name: "psar.x120.p0_003", // 0.44 | 0.23 without close
      fn: x => [x.ind.psar.x120.p0_003.result]
    },
    {
      name: "kst.x480.p_sig3_roc5_smaroc_5", // 0.52 | 0.47 without signal...
      fn: x => [x.ind.kst.x480.p_sig3_roc5_smaroc_5.kst]
    },
    {
      name: "lrc.x60.p10", // 0.51
      fn: x => [x.ind.lrc.x60.p10 - x.close]
    },
    {
      name: "emaOCC.x1440.p25", // 0.57
      fn: x => [x.ind.emaOCC.x1440.p25.diff]
    },
    {
      name: "vixFix.x480.a", // 0.56
      fn: x => [x.ind.vixFix.x480.a]
    },
    {
      name: "mfi.x480.p45", // 0.42
      fn: x => [x.ind.mfi.x480.p45]
    },
    {
      name: "bbands.x480.p30_dev2", // 0.45
      fn: x => [x.ind.bbands.x480.p30_dev2.lower, x.ind.bbands.x480.p30_dev2.upper]
    },
    // overall macds doesn't look too good in this
    {
      name: "t3Macd.x60.sig9", // 0.45
      fn: x => [x.ind.t3Macd.x60.sig9.histo]
    },
    {
      name: "zerolagMACD.x60.sig2_10", // 0.45
      fn: x => [x.ind.zerolagMACD.x60.sig2_10.histo]
    },

    {
      name: "emaOCC.vixFix",
      fn: x => [x.ind.emaOCC.x1440.p25.diff, x.ind.vixFix.x480.a]
    },

    {
      name: "emaOCC.vixFix.kst",
      fn: x => [x.ind.emaOCC.x1440.p25.diff, x.ind.vixFix.x480.a, x.ind.kst.x480.p_sig3_roc5_smaroc_5.kst]
    },

    {
      name: "emaOCC.vixFix.kst2",
      fn: x => [
        x.ind.emaOCC.x1440.p25.diff,
        x.ind.vixFix.x480.a,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.kst,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.signal
      ]
    },

    {
      name: "emaOCC.vixFix.kst2.lrc",
      fn: x => [
        x.ind.emaOCC.x1440.p25.diff,
        x.ind.vixFix.x480.a,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.kst,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.signal,
        x.ind.lrc.x60.p10 - x.close
      ]
    },
    {
      name: "emaOCC.vixFix.kst2.lrc.mfi",
      fn: x => [
        x.ind.emaOCC.x1440.p25.diff,
        x.ind.vixFix.x480.a,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.kst,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.signal,
        x.ind.lrc.x60.p10 - x.close,
        x.ind.mfi.x480.p45
      ]
    },
    {
      name: "emaOCC.vixFix.kst2.lrc.chandelierExit",
      fn: x => [
        x.ind.emaOCC.x1440.p25.diff,
        x.ind.vixFix.x480.a,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.kst,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.signal,
        x.ind.lrc.x60.p10 - x.close,
        x.ind.chandelierExit.x240.p20_2.exitLong,
        x.ind.chandelierExit.x240.p20_2.exitShort
      ]
    },
    {
      name: "emaOCC.vixFix.kst2.lrc.mfi.chandelierExit",
      fn: x => [
        x.ind.emaOCC.x1440.p25.diff,
        x.ind.vixFix.x480.a,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.kst,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.signal,
        x.ind.lrc.x60.p10 - x.close,
        x.ind.mfi.x480.p45,
        x.ind.chandelierExit.x240.p20_2.exitLong,
        x.ind.chandelierExit.x240.p20_2.exitShort
      ]
    },
    {
      name: "emaOCC.vixFix.kst2.lrc.mfi.chandelierExit.t3Macd",
      fn: x => [
        x.ind.emaOCC.x1440.p25.diff,
        x.ind.vixFix.x480.a,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.kst,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.signal,
        x.ind.lrc.x60.p10 - x.close,
        x.ind.mfi.x480.p45,
        x.ind.chandelierExit.x240.p20_2.exitLong,
        x.ind.chandelierExit.x240.p20_2.exitShort,
        x.ind.t3Macd.x60.sig9.histo
      ]
    },
    {
      name: "emaOCC.vixFix.kst2.lrc.mfi.chandelierExit.t3Macd.bbands",
      fn: x => [
        x.ind.emaOCC.x1440.p25.diff,
        x.ind.vixFix.x480.a,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.kst,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.signal,
        x.ind.lrc.x60.p10 - x.close,
        x.ind.mfi.x480.p45,
        x.ind.chandelierExit.x240.p20_2.exitLong,
        x.ind.chandelierExit.x240.p20_2.exitShort,
        x.ind.t3Macd.x60.sig9.histo,
        x.ind.bbands.x480.p30_dev2.lower,
        x.ind.bbands.x480.p30_dev2.upper
      ]
    },
    {
      name: "emaOCC.vixFix.kst2.lrc.mfi.chandelierExit.t3Macd.bbands.rsi",
      fn: x => [
        x.ind.emaOCC.x1440.p25.diff,
        x.ind.vixFix.x480.a,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.kst,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.signal,
        x.ind.lrc.x60.p10 - x.close,
        x.ind.mfi.x480.p45,
        x.ind.chandelierExit.x240.p20_2.exitLong,
        x.ind.chandelierExit.x240.p20_2.exitShort,
        x.ind.t3Macd.x60.sig9.histo,
        x.ind.bbands.x480.p30_dev2.lower,
        x.ind.bbands.x480.p30_dev2.upper,
        x.ind.rsi.x1440.p15
      ]
    }
  ];
};
