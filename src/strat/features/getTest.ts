import { FeatureSplit } from "./FeatureSplit";

export const getTest = (): FeatureSplit[] => {
  return [
    {
      name: "emaOCC.vixFix.kst2.lrc.mfi.chandelierExit.t3Macd.bbands.rsi.x60",
      fn: x => [
        x.ind.emaOCC.x60.p25.diff,
        x.ind.vixFix.x60.a,
        x.ind.kst.x60.p_sig3_roc5_smaroc_5.kst,
        x.ind.kst.x60.p_sig3_roc5_smaroc_5.signal,
        x.ind.lrc.x60.p10 - x.close,
        x.ind.mfi.x60.p45,
        x.ind.chandelierExit.x60.p20_2.exitLong,
        x.ind.chandelierExit.x60.p20_2.exitShort,
        x.ind.t3Macd.x60.sig9.histo,
        x.ind.bbands.x60.p30_dev2.lower,
        x.ind.bbands.x60.p30_dev2.upper,
        x.ind.rsi.x60.p15
      ]
    }
  ];
};
