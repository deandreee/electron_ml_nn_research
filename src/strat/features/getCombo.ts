import { FeatureSplit } from "./FeatureSplit";

export const getCombo = (): FeatureSplit[] => {
  return [
    { name: "rsi_combo", fn: x => [x.ind.rsi30x10, x.ind.rsi60x10, x.ind.rsi120x10, x.ind.rsi240x10] },
    { name: "rsi_combo_2", fn: x => [x.ind.rsi30x30, x.ind.rsi60x10, x.ind.rsi480x10] },
    { name: "rsi_combo_2_mfi", fn: x => [x.ind.rsi30x30, x.ind.rsi60x10, x.ind.rsi480x10, x.ind.mfi60_15] },
    {
      name: "rsi_combo_2_mfi_stoch",
      fn: x => [
        x.ind.rsi30x30,
        x.ind.rsi60x10,
        x.ind.rsi480x10,
        x.ind.mfi60_15,
        x.ind.stochKD60_20.k,
        x.ind.stochKD60_20.d
      ]
    },
    {
      name: "rsi_combo_3_mfi_stoch",
      fn: x => [
        x.ind.rsi240x20,
        // x.ind.rsi240x30,
        x.ind.rsi480x10,
        // x.ind.rsi480x20,
        x.ind.mfi60_15,
        x.ind.stochKD60_20.k,
        x.ind.stochKD60_20.d,
        x.ind.macd120.histo,
        x.ind.macd240.histo
      ]
    },

    {
      name: "rsi_combo_3_mfi_stoch_macdadx",
      fn: x => [
        x.ind.rsi240x20,
        // x.ind.rsi240x30,
        x.ind.rsi480x10,
        // x.ind.rsi480x20,
        x.ind.mfi60_15,
        x.ind.stochKD60_20.k,
        x.ind.stochKD60_20.d,
        x.ind.macd120.histo,
        x.ind.macd240.histo,
        x.ind.macd60_ADX120
      ]
    },

    {
      name: "combo_single_each",
      fn: x => [
        x.ind.rsi240x20,
        // x.ind.rsi240x30,
        // x.ind.rsi480x10,
        // x.ind.rsi480x20,
        x.ind.mfi60_15,
        x.ind.stochKD60_20.k - x.ind.stochKD60_20.d,
        // ,
        // x.ind.macd120.histo,
        // x.ind.macd240.histo,
        x.ind.macd60.histo,
        x.ind.macd60_ADX120,
        x.ind.bbands120_10_1.upper - x.ind.bbands120_10_1.lower
      ]
    },

    {
      name: "rsi_combo_macd",
      fn: x => [
        x.ind.rsi30x10,
        x.ind.rsi60x10,
        x.ind.rsi120x10,
        x.ind.rsi240x10,
        x.ind.rsi480x10,
        x.ind.macd30.histo,
        x.ind.macd60.histo,
        x.ind.macd120.histo,
        x.ind.macd240.histo
      ]
    },
    {
      name: "rsi_combo_macd_bbands",
      fn: x => [
        x.ind.rsi30x10,
        x.ind.rsi60x10,
        x.ind.rsi120x10,
        x.ind.rsi240x10,
        x.ind.rsi480x10,
        x.ind.macd30.histo,
        x.ind.macd60.histo,
        x.ind.macd120.histo,
        x.ind.macd240.histo,
        x.ind.bbands60_10_1.upper - x.ind.bbands60_10_1.lower,
        x.ind.bbands60_20_1.upper - x.ind.bbands60_20_1.lower,
        x.ind.bbands120_10_1.upper - x.ind.bbands120_10_1.lower,
        x.ind.bbands120_20_1.upper - x.ind.bbands120_20_1.lower
      ]
    },
    {
      name: "mfi_vixfix_rsi",
      fn: x => [x.ind.rsi240x20, x.ind.mfi480_60, x.ind.vixFix480]
    },
    {
      name: "mfi_vixfix_rsi_bbands",
      fn: x => [
        x.ind.rsi240x20,
        x.ind.mfi480_60,
        x.ind.vixFix480,
        x.ind.bbands120_10_1.upper - x.ind.bbands120_10_1.lower
      ]
    },
    {
      name: "mfi_vixfix_rsi_stoch",
      fn: x => [x.ind.rsi240x20, x.ind.mfi480_60, x.ind.vixFix480, x.ind.stochKD60_20.k]
    }
  ];
};
