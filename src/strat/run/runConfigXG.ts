import * as GAOpts from "./ga/GAOpts";

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

export const getConfigGrid = () => {
  let idx = 0;
  const gridOpts: RunConfigXG[] = [];
  for (let eta of GAOpts.XG.props.eta) {
    for (let gamma of GAOpts.XG.props.gamma) {
      for (let max_depth of GAOpts.XG.props.max_depth) {
        for (let min_child_weight of GAOpts.XG.props.min_child_weight) {
          for (let subsample of GAOpts.XG.props.subsample) {
            for (let iterations of GAOpts.XG.props.iterations) {
              gridOpts.push({
                idx: idx++,
                eta: eta as number,
                gamma: gamma as number,
                max_depth: max_depth as number,
                min_child_weight: min_child_weight as number,
                subsample: subsample as number,
                iterations: iterations as number
              });
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

export const runConfigXG_LessFit_1 = {
  idx: -999,
  eta: 0.3,
  gamma: 0,
  max_depth: 3,
  min_child_weight: 1,
  subsample: 0.7,
  iterations: 10,
  colsample_bytree: 1
};

// default
// https://xgboost.readthedocs.io/en/latest/parameter.html
// very very good for single ...
export const runConfigXGDef = {
  idx: -999,
  eta: 0.3,
  gamma: 0,
  max_depth: 6,
  min_child_weight: 1,
  subsample: 1,
  iterations: 10,
  colsample_bytree: 1
};

export const getName = (cfg: RunConfigXG) => {
  return `${cfg.idx}::: eta ${cfg.eta} | gamma ${cfg.gamma} | dpt ${cfg.max_depth} | child ${
    cfg.min_child_weight
  } | sub ${cfg.subsample} | it ${cfg.iterations}`;
};

// one of the best in GA tests
// IDX	ETA	GAMMA	MAX_DEPTH	MIN_CHILD_WEIGHT	SUBSAMPLE	ITERATIONS
// 437	0.3	3	3	5	0.3	5

export const runConfigXG2 = {
  idx: -2,
  eta: 0.3,
  gamma: 3,
  max_depth: 3,
  min_child_weight: 5,
  subsample: 0.3,
  iterations: 5,
  colsample_bytree: 1
};

// opt for macd.vixFix.vwap.t3Macd.zerolagMACD.kst
// BTC	AVG	ONE	macd.vixFix.vwap.t3Macd.zerolagMACD.kst	1229	0.05	3	2	5	0.3	50
// 0.67	0.62	0.64	0.66	0.66	75/86	7/7	70/59
// very bad in DEC
export const runConfigXG3 = {
  idx: -3,
  eta: 0.05,
  gamma: 3,
  max_depth: 2,
  min_child_weight: 5,
  subsample: 0.3,
  iterations: 50,
  colsample_bytree: 1
};

// opt for macd.vixFix.vwap.t3Macd.zerolagMACD.kst
// much more BETS
// BTC	AVG	ONE	macd.vixFix.vwap.t3Macd.zerolagMACD.kst	156	0.3	3	2	2	0.3	10
// 0.62	0.71	0.65	0.69	0.7	237/504	283/279	724/461
// reasonably good in all, overall better I'd say
export const runConfigXG4 = {
  idx: -4,
  eta: 0.3,
  gamma: 3,
  max_depth: 2,
  min_child_weight: 2,
  subsample: 0.3,
  iterations: 10,
  colsample_bytree: 1
};

// opt for x240.macd.sig9 => 0.54
// BTC	AVG	ONE	x240.macd.sig9	39	0.7	3	0	0	1	50
// 0.55	0.54	0.54	0.48	0.74	473/506	558/374	293/444
// relatively ok for simple params
export const runConfigXG5 = {
  idx: -5,
  eta: 0.7,
  gamma: 3,
  max_depth: 0,
  min_child_weight: 0,
  subsample: 1,
  iterations: 50,
  colsample_bytree: 1
};

// opt for x240.macd.sig9 => 0.53
// BTC	AVG	ONE	x240.macd.sig9	14	0.5	3	6	2	0.3	10
// 0.53	0.54	0.53	0.53	0.85	538/669	1146/657	199/557
// looks like best for single
export const runConfigXG6 = {
  idx: -6,
  eta: 0.5,
  gamma: 3,
  max_depth: 6,
  min_child_weight: 2,
  subsample: 0.3,
  iterations: 10,
  colsample_bytree: 1
};
