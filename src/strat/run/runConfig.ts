import { BatchConfig } from "../corr/BatchConfig";
import { RunConfigXG, runConfigXGDef } from "./runConfigXG";

export type BarrierLabel = "PT_FIVE" | "ONE" | "TWO" | "THREE" | "FIVE";

export type BarrierType = "double" | "tripple" | "up" | "down";

export interface RunConfig {
  BATCH: BatchConfig;
  PROB: number;
  XG: RunConfigXG;
  XG_OBJECTIVE: string;
  PRED_PROB: number;
  BARRIER_LABEL: BarrierLabel;
  BARRIER_TYPE: BarrierType;
  UNIQUE_LABELS: number[];
  MAX_CLASS_IMBALANCE: number;
}

export const runConfig: RunConfig = {
  BATCH: new BatchConfig(60, 1440),
  // PROB: 0.6,
  PROB: 0,
  XG: runConfigXGDef,
  BARRIER_LABEL: "FIVE",

  // BARRIER_TYPE: "tripple",
  // UNIQUE_LABELS: [0, 1, 2]

  XG_OBJECTIVE: "binary:logistic",
  // XG_OBJECTIVE: "reg:logistic",
  PRED_PROB: 0.5,

  BARRIER_TYPE: "up",
  UNIQUE_LABELS: [0, 1],
  MAX_CLASS_IMBALANCE: 0.4
};

// export const BARRIER_TYPE:BarrierType = "doubleBarrier";
// export const UNIQUE_LABELS = [0, 1];
