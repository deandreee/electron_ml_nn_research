import { FeatureSplit } from "./FeatureSplit";

export const getTest = (): FeatureSplit[] => {
  return [
    {
      name: "mfi_vixfix_rsi",
      fn: x => [x.ind.rsi240x20, x.ind.mfi480_60, x.ind.vixFix480]
    }
  ];
};
