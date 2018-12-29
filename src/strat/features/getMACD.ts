import { FeatureSplit } from "./FeatureSplit";

export const getMACD = (): FeatureSplit[] => {
  return [
    { name: "macd30", fn: x => [x.ind.macd30.histo] },
    { name: "macd60", fn: x => [x.ind.macd60.histo] },
    { name: "macd120", fn: x => [x.ind.macd120.histo] },
    { name: "macd240", fn: x => [x.ind.macd240.histo] },

    { name: "zerolagMacd30", fn: x => [x.ind.zerolagMacd30.histo] },
    { name: "zerolagMacd60", fn: x => [x.ind.zerolagMacd60.histo] },
    { name: "zerolagMacd120", fn: x => [x.ind.zerolagMacd120.histo] },
    { name: "zerolagMacd240", fn: x => [x.ind.zerolagMacd240.histo] }
  ];
};
