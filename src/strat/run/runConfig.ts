import { BatchConfig } from "../corr/BatchConfig";
import { RunConfigXG, runConfigXGDef } from "./runConfigXG";

export type BarrierLabel = "PT_FIVE" | "ONE" | "TWO" | "THREE" | "FIVE";

export type BarrierType = "double" | "tripple";

export interface RunConfig {
  BATCH: BatchConfig;
  PROB: number;
  XG: RunConfigXG;
  BARRIER_LABEL: BarrierLabel;
  BARRIER_TYPE: BarrierType;
  UNIQUE_LABELS: number[];
}

export const runConfig: RunConfig = {
  BATCH: new BatchConfig(60, 1440),
  // PROB: 0.6,
  PROB: 0,
  XG: runConfigXGDef,
  BARRIER_LABEL: "FIVE",
  BARRIER_TYPE: "tripple",
  UNIQUE_LABELS: [0, 1, 2]
};

// export const BARRIER_TYPE:BarrierType = "doubleBarrier";
// export const UNIQUE_LABELS = [0, 1];
