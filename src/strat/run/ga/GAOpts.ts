import { GAOpts } from "./common";

// https://xgboost.readthedocs.io/en/latest/parameter.html
export const XG: GAOpts = {
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

// https://www.wouterbulten.nl/blog/tech/lightweight-javascript-library-for-noise-filtering/
export const Kalman: GAOpts = {
  R: [0.01, 0.02, 0.05, 0.1],
  Q: [1, 2, 3, 5, 10, 20],
  B: [1, 2, 3, 5, 10, 20],
  A: [1, 1.1, 1.2, 1.3, 1.5, 1.8, 2]
};

export const MACD: GAOpts = {
  short: [2, 5, 7, 9, 12, 15, 20, 25, 30],
  long: [25, 30, 35, 40, 45, 50],
  signal: [2, 5, 7, 9, 12, 15, 20, 25, 30]
};

export const VixFix: GAOpts = {
  pd: [10, 15, 22, 25, 30],
  bbl: [10, 15, 22, 25, 30],
  mult: [1, 1.5, 2, 2.5, 3, 4],
  lb: [30, 40, 50, 60, 70, 80, 90],
  ph: [0.7, 0.75, 0.8, 0.85, 0.9, 0.95]
};
