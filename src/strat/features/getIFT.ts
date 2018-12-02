import { FeatureSplit } from "./FeatureSplit";

export const getIFT = (): FeatureSplit[] => {
  return [
    {
      name: "ift30x5",
      fn: (x, i, corrCandles) => [x.ind.ift30x5]
    },
    {
      name: "ift60x5",
      fn: (x, i, corrCandles) => [x.ind.ift60x5]
    },
    {
      name: "ift60x15",
      fn: (x, i, corrCandles) => [x.ind.ift60x15]
    },
    {
      name: "ift10x15",
      fn: (x, i, corrCandles) => [x.ind.ift10x15]
    },
    {
      name: "ift30x15",
      fn: (x, i, corrCandles) => [x.ind.ift30x15]
    },
    {
      name: "ift120x15",
      fn: (x, i, corrCandles) => [x.ind.ift120x15]
    },
    {
      name: "ift10x30",
      fn: (x, i, corrCandles) => [x.ind.ift10x30]
    },
    {
      name: "ift10x30",
      fn: (x, i, corrCandles) => [x.ind.ift10x30]
    },
    {
      name: "ift60x30",
      fn: (x, i, corrCandles) => [x.ind.ift60x30]
    },
    {
      name: "ift120x30",
      fn: (x, i, corrCandles) => [x.ind.ift120x30]
    },
    {
      name: "ifts10x15",
      fn: (x, i, corrCandles) => [x.ind.ifts10x15]
    },
    {
      name: "ifts30x15",
      fn: (x, i, corrCandles) => [x.ind.ifts30x15]
    },
    {
      name: "ifts60x15",
      fn: (x, i, corrCandles) => [x.ind.ifts60x15]
    }
  ];
};
