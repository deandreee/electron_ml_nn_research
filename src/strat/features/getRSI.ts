import { FeatureSplit } from "./FeatureSplit";

export const getRSI = (): FeatureSplit[] => {
  return [
    { name: "rsi30x10", fn: x => [x.ind.rsi30x10] },
    { name: "rsi30x20", fn: x => [x.ind.rsi30x20] },
    { name: "rsi30x30", fn: x => [x.ind.rsi30x30] },
    { name: "rsi60x10", fn: x => [x.ind.rsi60x10] },
    { name: "rsi60x20", fn: x => [x.ind.rsi60x20] },
    { name: "rsi60x30", fn: x => [x.ind.rsi60x30] },
    { name: "rsi120x10", fn: x => [x.ind.rsi120x10] },
    { name: "rsi120x20", fn: x => [x.ind.rsi120x20] },
    { name: "rsi120x30", fn: x => [x.ind.rsi120x30] },
    { name: "rsi240x10", fn: x => [x.ind.rsi240x10] },
    { name: "rsi240x20", fn: x => [x.ind.rsi240x20] },
    { name: "rsi240x30", fn: x => [x.ind.rsi240x30] },
    { name: "rsi480x10", fn: x => [x.ind.rsi480x10] },
    { name: "rsi480x20", fn: x => [x.ind.rsi480x20] },
    { name: "rsi480x30", fn: x => [x.ind.rsi480x30] }
  ];
};
