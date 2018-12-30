import { FeatureSplit } from "./FeatureSplit";

export const getTest = (): FeatureSplit[] => {
  return [
    {
      name: "vixFixCombo",
      fn: x => [
        x.ind.vixFix.x30.a,
        x.ind.vixFix.x60.a,
        x.ind.vixFix.x120.a,
        x.ind.vixFix.x240.a,
        x.ind.vixFix.x480.a,
        x.ind.vixFix.x480.b,
        x.ind.vixFix.x480.e
      ]
    }
  ];
};
