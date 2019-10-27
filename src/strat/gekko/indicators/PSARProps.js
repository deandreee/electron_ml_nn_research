// smaller = less whipsaw
module.exports = {
  // https://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:parabolic_sar
  DEFAULTS_STOCKCHARTS: {
    // useless for LRC
    step: 0.02,
    max: 0.2,
  },
  CRYPTOWATCH: {
    step: 0.025,
    max: 0.05,
  },
  CRYPTOWATCH_HALF: {
    step: 0.0125,
    max: 0.025,
  },
  // was kinda ok for macd 120, but makes no sense because max should be larger
  _0_001: {
    step: 0.001,
    // max: 0.0025,
    max: 0.001, // +4% BTC Aug
    // max: 0.0005, // looked kinda ok
  },
  _0_002: {
    // no go for macd
    step: 0.002,
    max: 0.002,
  },
  _0_003: {
    step: 0.003,
    max: 0.003,
  },
  _0_004: {
    step: 0.004,
    max: 0.004,
  },
  _0_005: {
    step: 0.005,
    max: 0.005,
  },
  _0_006: {
    step: 0.006,
    max: 0.006,
  },
  _0_007: {
    step: 0.007,
    max: 0.007,
  },
  _0_0001: {
    step: 0.0001,
    max: 0.0001,
  },
  _0_0002: {
    // almost no diff
    step: 0.0002,
    max: 0.0002,
  },
  _0_0003: {
    // almost no diff
    step: 0.0003,
    max: 0.0003,
  },
  _0_0005: {
    // looked ok
    step: 0.0005,
    max: 0.0005,
  },
  // kinda ok but jumps a bit too slow for macd 120
  _0_0008: {
    // ok, reasonable difference
    step: 0.0008,
    max: 0.0008,
  },
};
