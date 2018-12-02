import { FeatureSplit } from "./FeatureSplit";

export const getBBands = (): FeatureSplit[] => {
  return [
    { name: "bbands60_10_1", fn: x => [x.ind.bbands60_10_1.upper - x.ind.bbands60_10_1.lower] },
    { name: "bbands60_10_2", fn: x => [x.ind.bbands60_10_2.upper - x.ind.bbands60_10_2.lower] },
    { name: "bbands60_10_3", fn: x => [x.ind.bbands60_10_3.upper - x.ind.bbands60_10_3.lower] },

    { name: "bbands60_20_1", fn: x => [x.ind.bbands60_20_1.upper - x.ind.bbands60_20_1.lower] },
    { name: "bbands60_20_2", fn: x => [x.ind.bbands60_20_2.upper - x.ind.bbands60_20_2.lower] },
    { name: "bbands60_20_3", fn: x => [x.ind.bbands60_20_3.upper - x.ind.bbands60_20_3.lower] },

    { name: "bbands60_30_1", fn: x => [x.ind.bbands60_30_1.upper - x.ind.bbands60_30_1.lower] },
    { name: "bbands60_30_2", fn: x => [x.ind.bbands60_30_2.upper - x.ind.bbands60_30_2.lower] },
    { name: "bbands60_30_3", fn: x => [x.ind.bbands60_30_3.upper - x.ind.bbands60_30_3.lower] },

    { name: "bbands120_10_1", fn: x => [x.ind.bbands120_10_1.upper - x.ind.bbands120_10_1.lower] },
    { name: "bbands120_10_2", fn: x => [x.ind.bbands120_10_2.upper - x.ind.bbands120_10_2.lower] },
    { name: "bbands120_10_3", fn: x => [x.ind.bbands120_10_3.upper - x.ind.bbands120_10_3.lower] },

    { name: "bbands120_20_1", fn: x => [x.ind.bbands120_20_1.upper - x.ind.bbands120_20_1.lower] },
    { name: "bbands120_20_2", fn: x => [x.ind.bbands120_20_2.upper - x.ind.bbands120_20_2.lower] },
    { name: "bbands120_20_3", fn: x => [x.ind.bbands120_20_3.upper - x.ind.bbands120_20_3.lower] },

    { name: "bbands120_30_1", fn: x => [x.ind.bbands120_30_1.upper - x.ind.bbands120_30_1.lower] },
    { name: "bbands120_30_2", fn: x => [x.ind.bbands120_30_2.upper - x.ind.bbands120_30_2.lower] },
    { name: "bbands120_30_3", fn: x => [x.ind.bbands120_30_3.upper - x.ind.bbands120_30_3.lower] }
  ];
};
