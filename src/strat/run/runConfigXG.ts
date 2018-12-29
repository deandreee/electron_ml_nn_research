export type TrippleBarrierLabel = "PT_FIVE" | "ONE" | "TWO" | "THREE";

// let's keep this const for now
export const TRIPPLE_BARRIER_LABEL: TrippleBarrierLabel = "TWO";

export interface RunConfigXG {
  [prop: string]: number;

  idx: number;
  eta: number; // 0.01,
  gamma: number;
  max_depth: number; // 3;
  min_child_weight: number;
  subsample: number;
  iterations: number;
}

interface RunConfigXGOpts {
  [prop: string]: number[];
}

// https://xgboost.readthedocs.io/en/latest/parameter.html
export const runConfigXGOpts: RunConfigXGOpts = {
  // eta [default=0.3, alias: learning_rate]
  eta: [0.01, 0.02, 0.05, 0.1, 0.3, 0.5, 0.7, 0.9],
  // [default=0, alias: min_split_loss]
  // range [0, infinity]
  gamma: [0, 1, 3, 5, 10, 50, 100, 200],

  // max_depth [default=6]
  // Maximum depth of a tree. Increasing this value will make the model more
  // complex and more likely to overfit. 0 indicates no limit.
  max_depth: [0, 1, 2, 3, 6, 12],

  // [default=1]
  // range [0, infinity]
  min_child_weight: [0, 1, 2, 5, 10],

  // Usually this parameter is not needed, but it might help in logistic regression
  // when class is extremely imbalanced. Set it to value of 1-10 might help control
  // the update.
  // max_delta_step: [0]
  // =====

  // [default=1]
  // Setting it to 0.5 means that XGBoost would randomly sample half of the
  // training data prior to growing trees. and this will prevent overfitting.
  subsample: [0.3, 0.5, 0.7, 0.8, 0.9, 1],

  iterations: [5, 10, 20, 50]
};

export const getConfigGrid = () => {
  let idx = 0;
  const gridOpts: RunConfigXG[] = [];
  for (let eta of runConfigXGOpts.eta) {
    for (let gamma of runConfigXGOpts.gamma) {
      for (let max_depth of runConfigXGOpts.max_depth) {
        for (let min_child_weight of runConfigXGOpts.min_child_weight) {
          for (let subsample of runConfigXGOpts.subsample) {
            for (let iterations of runConfigXGOpts.iterations) {
              gridOpts.push({ idx: idx++, eta, gamma, max_depth, min_child_weight, subsample, iterations });
            }
          }
        }
      }
    }
  }
  return gridOpts;
};

export const runConfigXG = {
  idx: -999,
  eta: 0.3,
  gamma: 0,
  max_depth: 3,
  min_child_weight: 1,
  subsample: 0.7,
  iterations: 10
};

export const getName = (cfg: RunConfigXG) => {
  return `${cfg.idx}::: eta ${cfg.eta} | gamma ${cfg.gamma} | dpt ${cfg.max_depth} | child ${
    cfg.min_child_weight
  } | sub ${cfg.subsample} | it ${cfg.iterations}`;
};
