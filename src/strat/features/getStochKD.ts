import { FeatureSplit } from "./FeatureSplit";

export const getStochKD = (): FeatureSplit[] => {
  return [
    { name: "stochKD60_10", fn: x => [x.ind.stochKD60_10.k, x.ind.stochKD60_10.d] },
    { name: "stochKD60_14", fn: x => [x.ind.stochKD60_14.k, x.ind.stochKD60_14.d] },
    { name: "stochKD60_20", fn: x => [x.ind.stochKD60_20.k, x.ind.stochKD60_20.d] },
    { name: "stochKD60_30", fn: x => [x.ind.stochKD60_30.k, x.ind.stochKD60_30.d] },
    { name: "stochKD120_10", fn: x => [x.ind.stochKD120_10.k, x.ind.stochKD120_10.d] },
    { name: "stochKD120_14", fn: x => [x.ind.stochKD120_14.k, x.ind.stochKD120_14.d] },
    { name: "stochKD120_20", fn: x => [x.ind.stochKD120_20.k, x.ind.stochKD120_20.d] },
    { name: "stochKD120_30", fn: x => [x.ind.stochKD120_30.k, x.ind.stochKD120_30.d] }
  ];
};
