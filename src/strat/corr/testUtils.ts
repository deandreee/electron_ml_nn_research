import { Candle } from "../types";
import { runConfigXGDef } from "../run/runConfigXG";
import { BatchConfig } from "./BatchConfig";
import { RunConfig } from "../run/runConfig";

export type Partial<T> = { [P in keyof T]?: T[P] };

export const createCandle = (partial: Partial<Candle>) => {
  const candle: Candle = {
    close: 0,
    start: 0,
    open: 0,
    high: 0,
    low: 0,
    volume: 0,
    vwp: 0,
    trades: 0,

    percentChange: 0,
    pctChange60m: 0,
    pctChange: {},

    ...partial
  };

  return candle;
};

export const start = (candle: Candle) => {
  return new Date(candle.start * 1000).toISOString();
};

export const logCandleStart = (candle: Candle) => {
  console.log(start(candle));
};

export const toUnix = (timeStr: string) => {
  return Math.floor(new Date(timeStr).getTime() / 1000);
};

export const getRunConfig = (batchConfig: BatchConfig): RunConfig => {
  return {
    BATCH: batchConfig,
    PROB: 0,
    XG: runConfigXGDef,
    XG_OBJECTIVE: "multi:softmax",
    PRED_PROB: 0.5,
    BARRIER_LABEL: "TWO",
    BARRIER_TYPE: "tripple",
    UNIQUE_LABELS: [0, 1, 2],
    MAX_CLASS_IMBALANCE: 0.65
  };
};
