import { FeatureSplit } from "./FeatureSplit";

export const getMACD = (): FeatureSplit[] => {
  return [
    { name: "macd30", fn: x => [x.ind.macd30.histo] },
    { name: "macd60", fn: x => [x.ind.macd60.histo] },
    { name: "macd120", fn: x => [x.ind.macd120.histo] },
    { name: "macd240", fn: x => [x.ind.macd240.histo] }
  ];
};
