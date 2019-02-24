import { FeatureSplit } from "./FeatureSplit";
import { getUpperMinusLower, getVsPrice } from "./getBBands";

export const getCombo = (): FeatureSplit[] => {
  return [
    { name: "[c]rsi_combo", fn: x => [x.ind.rsi.x30.p10, x.ind.rsi.x60.p10, x.ind.rsi.x120.p10, x.ind.rsi.x240.p10] },
    { name: "rsi_combo_2", fn: x => [x.ind.rsi.x30.p30, x.ind.rsi.x60.p10, x.ind.rsi.x480.p10] },
    { name: "rsi_combo_2_mfi", fn: x => [x.ind.rsi.x30.p30, x.ind.rsi.x60.p10, x.ind.rsi.x480.p10, x.ind.mfi.x60.p15] },
    {
      name: "rsi_combo_2_mfi_stoch",
      fn: x => [
        x.ind.rsi.x30.p30,
        x.ind.rsi.x60.p10,
        x.ind.rsi.x480.p10,
        x.ind.mfi.x60.p15,
        x.ind.stochKD.x60.p20.k,
        x.ind.stochKD.x60.p20.d
      ]
    },
    {
      name: "rsi_combo_3_mfi_stoch",
      fn: x => [
        x.ind.rsi.x240.p20,
        // x.ind.rsi240x30,
        x.ind.rsi.x480.p10,
        // x.ind.rsi480x20,
        x.ind.mfi.x60.p15,
        x.ind.stochKD.x60.p20.k,
        x.ind.stochKD.x60.p20.d,
        x.ind.macd.x120.sig9.histo,
        x.ind.macd.x240.sig9.histo
      ]
    },

    {
      name: "rsi_combo_3_mfi_stoch_macdadx",
      fn: x => [
        x.ind.rsi.x240.p20,
        // x.ind.rsi240x30,
        x.ind.rsi.x480.p10,
        // x.ind.rsi480x20,
        x.ind.mfi.x60.p15,
        x.ind.stochKD.x60.p20.k,
        x.ind.stochKD.x60.p20.d,
        x.ind.macd.x120.sig9.histo,
        x.ind.macd.x240.sig9.histo,
        x.ind.macd60_ADX120
      ]
    },

    {
      name: "[csi]combo_single_each",
      fn: x => [
        x.ind.rsi.x240.p20,
        // x.ind.rsi240x30,
        // x.ind.rsi480x10,
        // x.ind.rsi480x20,
        x.ind.mfi.x60.p15,
        x.ind.stochKD.x60.p20.k - x.ind.stochKD.x60.p20.d,
        // ,
        // x.ind.macd120.histo,
        // x.ind.macd240.histo,
        x.ind.macd.x60.sig9.histo,
        x.ind.macd60_ADX120,
        x.ind.bbands.x120.p10_dev1.upper - x.ind.bbands.x120.p10_dev1.lower
      ]
    },

    {
      name: "rsi_combo_macd",
      fn: x => [
        x.ind.rsi.x30.p10,
        x.ind.rsi.x60.p10,
        x.ind.rsi.x120.p10,
        x.ind.rsi.x240.p10,
        x.ind.rsi.x480.p10,
        x.ind.macd.x30.sig9.histo,
        x.ind.macd.x60.sig9.histo,
        x.ind.macd.x120.sig9.histo,
        x.ind.macd.x240.sig9.histo
      ]
    },
    {
      name: "rsi_combo_macd_bbands",
      fn: x => [
        x.ind.rsi.x30.p10,
        x.ind.rsi.x60.p10,
        x.ind.rsi.x120.p10,
        x.ind.rsi.x240.p10,
        x.ind.rsi.x480.p10,
        x.ind.macd.x30.sig9.histo,
        x.ind.macd.x60.sig9.histo,
        x.ind.macd.x120.sig9.histo,
        x.ind.macd.x240.sig9.histo,
        x.ind.bbands.x60.p10_dev1.upper - x.ind.bbands.x60.p10_dev1.lower,
        x.ind.bbands.x60.p20_dev1.upper - x.ind.bbands.x60.p20_dev1.lower,
        x.ind.bbands.x120.p10_dev1.upper - x.ind.bbands.x120.p10_dev1.lower,
        x.ind.bbands.x120.p20_dev1.upper - x.ind.bbands.x120.p20_dev1.lower
      ]
    },
    {
      name: "mfi_vixfix_rsi",
      fn: x => [x.ind.rsi.x240.p20, x.ind.mfi.x480.p60, x.ind.vixFix.x480.a]
    },
    {
      name: "mfi_vixfix_rsi_bbands",
      fn: x => [
        x.ind.rsi.x240.p20,
        x.ind.mfi.x480.p60,
        x.ind.vixFix.x480.a,
        x.ind.bbands.x120.p10_dev1.upper - x.ind.bbands.x120.p10_dev1.lower
      ]
    },
    {
      name: "mfi_vixfix_rsi_stoch",
      fn: x => [x.ind.rsi.x240.p20, x.ind.mfi.x480.p60, x.ind.vixFix.x480.a, x.ind.stochKD.x60.p20.k]
    },

    {
      name: "PT_FIVE_OPT_x4",
      fn: x => [x.ind.atr.p60, x.ind.vixFix.x120.b, x.ind.vwap.x240.p20.den, x.ind.macd.x240.sig9.histo]
    },

    {
      name: "PT_FIVE_OPT_x8",
      fn: x => [
        x.ind.atr.p60,
        x.ind.vixFix.x120.b,
        x.ind.vwap.x240.p20.den,
        x.ind.macd.x240.sig9.histo,
        x.ind.zerolagMACD.x480.sig2_16.histo,
        ...getVsPrice(x.ind.bbands.x240.p30_dev2, x.close),
        x.ind.emaOCC.x240x.p30.diff,
        x.ind.zerolagT3.x60.p10
      ]
    },

    {
      name: "ONE_OPT_x4",
      fn: x => [x.ind.vwap.x240.p10.den, x.ind.vixFix.x120.b, x.ind.macd.x480.sig2_10.histo, x.ind.lrc.x480.p45]
    },

    {
      name: "ONE_OPT_x8",
      fn: x => [
        x.ind.vwap.x240.p10.den,
        x.ind.vixFix.x120.b,
        x.ind.macd.x480.sig2_10.histo,
        x.ind.lrc.x480.p45,
        x.ind.macd120_ADX120,
        x.ind.vwap.x30.p30.den,
        x.ind.zerolagMACD.x480.sig2_16.histo,
        ...getVsPrice(x.ind.bbands.x240.p10_dev1, x.close)
      ]
    },

    {
      name: "TWO_OPT_x4",
      fn: x => [
        x.ind.vixFix.x480.d,
        x.ind.zerolagMACD.x480.sig2_16.histo,
        getUpperMinusLower(x.ind.bbands.x240.p10_dev1),
        x.ind.zerolagT3.x30.p60
      ]
    },

    {
      name: "TWO_OPT_x8",
      fn: x => [
        x.ind.vixFix.x480.d,
        x.ind.zerolagMACD.x480.sig2_16.histo,
        getUpperMinusLower(x.ind.bbands.x240.p10_dev1),
        x.ind.zerolagT3.x30.p60,
        x.ind.atr.p720,
        x.ind.lrc.x240.p30,
        x.ind.macd.x120.sig9.histo,
        x.ind.rsi.x480.p30
      ]
    },

    {
      name: "THREE_OPT_x4",
      fn: x => [x.ind.vixFix.x480.a, x.ind.atr.p720, ...getVsPrice(x.ind.bbands.x60.p10_dev3, x.close), x.ind.atr.p480]
    },

    {
      name: "THREE_OPT_x8",
      fn: x => [
        x.ind.vixFix.x480.a,
        x.ind.atr.p720,
        ...getVsPrice(x.ind.bbands.x60.p10_dev3, x.close),
        x.ind.atr.p480,
        x.ind.zerolagMACD.x480.sig2_16.histo,
        x.ind.rsi.x480.p30,
        x.ind.emaOCC.x480.p30.diff
      ]
    },

    {
      name: "FIVE_OPT_x4",
      fn: x => [
        x.ind.vixFix.x480.a,
        ...getVsPrice(x.ind.bbands.x120.p20_dev3, x.close),
        x.ind.vixFix.x240.b,
        x.ind.mfi.x480.p20
      ]
    },

    {
      name: "FIVE_OPT_x8",
      fn: x => [
        x.ind.vixFix.x480.a,
        ...getVsPrice(x.ind.bbands.x120.p20_dev3, x.close),
        x.ind.vixFix.x240.b,
        x.ind.mfi.x480.p20,
        x.ind.zerolagMACD.x480.sig2_16.histo,
        x.ind.vwap.x240.p20.den,
        x.ind.zerolagMACD.x120.sig2_16.histo,
        x.ind.mfi.x60.p60
      ]
    },

    {
      name: "vixFixCombo",
      fn: x => [x.ind.vixFix.x30.a, x.ind.vixFix.x60.a, x.ind.vixFix.x120.a]
    },

    {
      name: "macd.vixFix",
      fn: x => [x.ind.vixFix.x120.a, x.ind.macd.x120.sig9.histo]
    },

    {
      name: "macd.vixFix.rsi",
      fn: x => [x.ind.vixFix.x120.a, x.ind.macd.x120.sig9.histo, x.ind.rsi.x120.p15]
    },

    {
      name: "macd.vixFix.vwap",
      fn: x => [x.ind.vixFix.x120.a, x.ind.macd.x120.sig9.histo, x.ind.vwap.x30.p40.den]
    },

    {
      name: "macd.vixFix.vwap.kst",
      fn: x => [x.ind.vixFix.x120.a, x.ind.macd.x120.sig9.histo, x.ind.vwap.x30.p40.den, x.ind.kst.x60.p_sig3.kst]
    },

    {
      name: "macd.vixFix.vwap.t3Macd",
      fn: x => [
        x.ind.vixFix.x120.a,
        x.ind.macd.x120.sig9.histo,
        x.ind.vwap.x30.p40.den,
        x.ind.t3Macd.x120.sig2_16.histo
      ]
    },

    {
      name: "macd.vixFix.vwap.emaOCC",
      fn: x => [x.ind.vixFix.x120.a, x.ind.macd.x120.sig9.histo, x.ind.vwap.x30.p40.den, x.ind.emaOCC.x60.p20.diff]
    },

    {
      name: "macd.vixFix.vwap.psar",
      fn: x => [x.ind.vixFix.x120.a, x.ind.macd.x120.sig9.histo, x.ind.vwap.x30.p40.den, x.ind.psar.x30.p0_0002.result]
    },

    {
      name: "macd.vixFix.vwap.zerolagMACD",
      fn: x => [
        x.ind.vixFix.x120.a,
        x.ind.macd.x120.sig9.histo,
        x.ind.vwap.x30.p40.den,
        x.ind.zerolagMACD.x480.sig2_16.histo
      ]
    },

    {
      name: "macd.vixFix.vwap.lrc",
      fn: x => [x.ind.vixFix.x120.a, x.ind.macd.x120.sig9.histo, x.ind.vwap.x30.p40.den, x.ind.lrc.x480.p30]
    },

    {
      name: "macd.vixFix.vwap.t3Macd.zerolagMACD",
      fn: x => [
        x.ind.vixFix.x120.a,
        x.ind.macd.x120.sig9.histo,
        // x.ind.vwap.x30.p40.den,
        x.ind.t3Macd.x120.sig2_16.histo,
        x.ind.zerolagMACD.x480.sig2_16.histo
      ]
    },

    // 0.67 the very best so far on LBL ONE
    {
      name: "macd.vixFix.vwap.t3Macd.zerolagMACD.kst",
      fn: x => [
        x.ind.vixFix.x120.a,
        x.ind.macd.x120.sig9.histo,
        // x.ind.vwap.x30.p40.den,  // replace, no longer x30
        // x.ind.vwap.x60.p40.den,
        x.ind.t3Macd.x120.sig2_16.histo,
        x.ind.zerolagMACD.x480.sig2_16.histo,
        x.ind.kst.x60.p_sig3.kst
      ]
    }
  ];
};
