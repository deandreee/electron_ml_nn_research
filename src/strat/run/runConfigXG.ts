export type TrippleBarrierLabel = "PT_FIVE" | "ONE" | "TWO" | "THREE";

// let's keep this const for now
export const TRIPPLE_BARRIER_LABEL: TrippleBarrierLabel = "TWO";

export interface RunConfigXG {
  idx: number;
  max_depth: number; // 3;
  eta: number; // 0.01,
}

export const runConfigXGOpts = {
  max_depth: [1, 2, 3],
  eta: [0.01, 0.02, 0.05]
};

export const getConfigGrid = () => {
  let idx = 0;
  const gridOpts: RunConfigXG[] = [];
  for (let max_depth of runConfigXGOpts.max_depth) {
    for (let eta of runConfigXGOpts.eta) {
      gridOpts.push({ idx: idx++, max_depth, eta });
    }
  }
  return gridOpts;
};

export const runConfigXG = {
  idx: -999,
  max_depth: 3,
  eta: 0.01
};

export const getName = (cfg: RunConfigXG) => {
  return `${cfg.idx}::: ${cfg.max_depth}/${cfg.eta}`;
};
