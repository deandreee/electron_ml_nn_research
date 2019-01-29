import { GAOpts, GAEntity } from "./common";

// https://xgboost.readthedocs.io/en/latest/parameter.html
// https://www.analyticsvidhya.com/blog/2016/03/complete-guide-parameter-tuning-xgboost-with-codes-python/
export const XG: GAOpts = {
  props: {
    // eta [default=0.3, alias: learning_rate]
    eta: [0.01, 0.02, 0.05, 0.1, 0.3, 0.5, 0.7, 0.9],
    // [default=0, alias: min_split_loss]
    // range [0, infinity]
    gamma: [0, 0.1, 0.2, 0.5, 1, 3, 5, 10, 20, 50, 100, 200],

    // max_depth [default=6]
    // Maximum depth of a tree. Increasing this value will make the model more
    // complex and more likely to overfit. 0 indicates no limit.
    max_depth: [0, 1, 2, 3, 6, 12],

    // [default=1]
    // range [0, infinity]
    min_child_weight: [0, 1, 2, 3, 5, 7, 10],

    // Usually this parameter is not needed, but it might help in logistic regression
    // when class is extremely imbalanced. Set it to value of 1-10 might help control
    // the update.
    // max_delta_step: [0]
    // =====

    // [default=1]
    // Setting it to 0.5 means that XGBoost would randomly sample half of the
    // training data prior to growing trees. and this will prevent overfitting.
    subsample: [0.3, 0.5, 0.7, 0.8, 0.9, 1],

    iterations: [5, 10, 20, 50],

    // max_leaf_nodes If this is defined, GBM will ignore max_depth.

    // Usually this parameter is not needed, but it might help in logistic regression when class is extremely imbalanced.
    // This is generally not used but you can explore further if you wish.
    // max_delta_step

    // Similar to max_features in GBM. Denotes the fraction of columns
    // to be randomly samples for each tree.
    // Typical values: 0.5-1
    // [default=1]
    colsample_bytree: [0.3, 0.5, 0.7, 0.8, 0.9, 1]

    // Denotes the subsample ratio of columns for each split, in each level.
    // I don’t use this often because subsample and colsample_bytree will do the
    // job for you. but you can explore further if you feel so.
    // colsample_bylevel

    // L2 regularization term on weights (analogous to Ridge regression)
    // This used to handle the regularization part of XGBoost. Though many
    // data scientists don’t use it often, it should be explored to reduce overfitting.
    // lambda [default=1]

    // Can be used in case of very high dimensionality so that the algorithm
    // runs faster when implemented
    // alpha [default=0]

    // A value greater than 0 should be used in case of
    // high class imbalance as it helps in faster convergence.
    // scale_pos_weight [default=1]
  }
};

// https://www.wouterbulten.nl/blog/tech/lightweight-javascript-library-for-noise-filtering/
export const Kalman: GAOpts = {
  props: {
    R: [0.01, 0.02, 0.05, 0.1],
    Q: [1, 2, 3, 5, 10, 20],
    B: [1, 2, 3, 5, 10, 20],
    A: [1, 1.1, 1.2, 1.3, 1.5, 1.8, 2]
  }
};

export const MACD: GAOpts = {
  props: {
    short: [2, 5, 7, 9, 12, 15, 20, 25, 30],
    long: [25, 30, 35, 40, 45, 50],
    signal: [2, 5, 7, 9, 12, 15, 20, 25, 30]
  }
};

export const VixFix: GAOpts = {
  props: {
    pd: [10, 15, 22, 25, 30],
    bbl: [10, 15, 22, 25, 30],
    mult: [1, 1.5, 2, 2.5, 3, 4],
    lb: [30, 40, 50, 60, 70, 80, 90],
    ph: [0.7, 0.75, 0.8, 0.85, 0.9, 0.95]
  }
};

export const KST: GAOpts = {
  props: {
    ROCPer1: [5, 10, 15, 20, 25],
    ROCDiff: [3, 5, 7, 10],
    SMAROCPer1: [5, 10, 15, 20, 25],
    SMAROCDiff: [3, 5, 7, 10],
    signalPeriod: [3, 5, 7, 9, 12, 15, 20]
  },
  transform: (gaEntity: GAEntity) => {
    return {
      ROCPer1: gaEntity.ROCPer1,
      ROCPer2: (gaEntity.ROCPer1 as number) + (gaEntity.ROCDiff as number),
      ROCPer3: (gaEntity.ROCPer1 as number) + (gaEntity.ROCDiff as number) * 2,
      ROCPer4: (gaEntity.ROCPer1 as number) + (gaEntity.ROCDiff as number) * 3,
      SMAROCPer1: gaEntity.SMAROCPer1,
      SMAROCPer2: (gaEntity.SMAROCPer1 as number) + (gaEntity.SMAROCDiff as number),
      SMAROCPer3: (gaEntity.SMAROCPer1 as number) + (gaEntity.SMAROCDiff as number) * 2,
      SMAROCPer4: (gaEntity.SMAROCPer1 as number) + (gaEntity.SMAROCDiff as number) * 3,
      signalPeriod: gaEntity.signalPeriod
    };
  }
};
