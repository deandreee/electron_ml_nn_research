import { BatchConfig } from "../../corr/BatchConfig";
import { RunConfigXG } from "./runConfigXG";
import * as CFG from "./runConfigXG";

// is this needed in regression?
export type BarrierLabel = "PT_FIVE" | "ONE" | "TWO" | "THREE" | "FIVE";

// double/tripple if classification
// _Xd if regression
export type BarrierType = "_1d" | "_2d" | "_5d" | "_7d" | "_10d" | "double" | "tripple" | "up" | "down";

export type XGObjective = "multi:softmax" | "reg:logistic" | "reg:linear" | "binary:logistic";

export interface RunConfig {
  BATCH: BatchConfig;
  PROB: number;
  XG: RunConfigXG;
  XG_OBJECTIVE: XGObjective;
  PRED_PROB?: number;
  BARRIER_LABEL: BarrierLabel;
  BARRIER_TYPE: BarrierType;
  UNIQUE_LABELS?: number[]; // not needed for reg
  MAX_CLASS_IMBALANCE?: number;
}

export const runConfig: RunConfig = {
  BATCH: new BatchConfig(60, 1440),
  // PROB: 0.6,
  PROB: 0,
  // XG: CFG.runConfigXGDef,
  XG: CFG.runConfigXG_LessFit_6, // TODO: watch out for this !!!

  BARRIER_LABEL: "THREE",
  XG_OBJECTIVE: "multi:softmax",
  BARRIER_TYPE: "tripple",
  UNIQUE_LABELS: [0, 1, 2],
  MAX_CLASS_IMBALANCE: 0.6

  // BARRIER_LABEL: "THREE"
  // XG_OBJECTIVE: "multi:softmax",
  // BARRIER_TYPE: "double",
  // UNIQUE_LABELS: [0, 1],
  // MAX_CLASS_IMBALANCE: 0.4

  // XG_OBJECTIVE: "binary:logistic",
  // XG_OBJECTIVE: "reg:logistic",
  // PRED_PROB: 0.5

  // BARRIER_LABEL: "THREE", // I don't think reg even needs this, but breaks without
  // XG_OBJECTIVE: "reg:linear",
  // BARRIER_TYPE: "_1d"
};

// export const BARRIER_TYPE:BarrierType = "doubleBarrier";
// export const UNIQUE_LABELS = [0, 1];

export const isRegression = (runConfig: RunConfig) => {
  return runConfig.XG_OBJECTIVE.startsWith("reg:");
};
