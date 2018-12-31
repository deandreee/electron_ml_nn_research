import { FeatureSplit } from "./FeatureSplit";

export const getCombo = (): FeatureSplit[] => {
  return [
    { name: "rsi_combo", fn: x => [x.ind.rsi.x30.p10, x.ind.rsi.x60.p10, x.ind.rsi.x120.p10, x.ind.rsi.x240.p10] },
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
      name: "combo_single_each",
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
    }
  ];
};
