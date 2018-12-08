import { FeatureSplit } from "./FeatureSplit";

export const getVixFix = (): FeatureSplit[] => {
  return [
    { name: "vixFix30", fn: x => [x.ind.vixFix30] },
    { name: "vixFix60", fn: x => [x.ind.vixFix60] },
    { name: "vixFix120", fn: x => [x.ind.vixFix120] },
    { name: "vixFix240", fn: x => [x.ind.vixFix240] },
    { name: "vixFix480", fn: x => [x.ind.vixFix480] },
    { name: "vixFix480_a", fn: x => [x.ind.vixFix480_a] },
    { name: "vixFix480_b", fn: x => [x.ind.vixFix480_b] },
    { name: "vixFix480_c", fn: x => [x.ind.vixFix480_c] },
    { name: "vixFix480_d", fn: x => [x.ind.vixFix480_d] },
    { name: "vixFix480_e", fn: x => [x.ind.vixFix480_e] },
    { name: "vixFix480_f", fn: x => [x.ind.vixFix480_f] },
    { name: "vixFix480_g", fn: x => [x.ind.vixFix480_g] },
    { name: "vixFix480_h", fn: x => [x.ind.vixFix480_h] }
  ];
};
