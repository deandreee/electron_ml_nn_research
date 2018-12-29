import { FeatureSplit } from "./FeatureSplit";

export const getTest = (): FeatureSplit[] => {
  return [
    {
      name: "vixFixCombo",
      fn: x => [
        x.ind.vixFix30,
        x.ind.vixFix60,
        x.ind.vixFix120,
        x.ind.vixFix240,
        x.ind.vixFix480,
        x.ind.vixFix480_a,
        x.ind.vixFix480_d
      ]
    }
  ];
};
