const { getDiffPercent } = require("./getDiffPercent");
const CandleBatcher2 = require("./CandleBatcher2");
const XmBase = require("./XmBase");
const WaveManager = require("./WaveManager");
const BatchWaveManager = require("./BatchWaveManager");
const { valueToOHLC } = require("./valueToOHLC");
const { round0, round2 } = require("./round");
const spearson = require("./spearson");
const getPctChange = require("./getPctChange");
const { Cooldown, CooldownXm } = require("./Cooldown");
const Queue = require("./Queue");
const { batchCandlesInXs, batchIndInXs } = require("./batchInXs");
const makeid = require("./makeid");
const timer = require("./timer");
const memorySizeOf = require("./memorySizeOf");
const { getAssetIdx } = require("./assetOrder");

const max = (a, b) => {
  const nums = [a, b].filter(x => !isNaN(x));
  return Math.max.apply(null, nums);
};

const getCandlesPerBatchDay = batchSize => {
  const DAY_MINS = 1440;
  const candlesPerDay = DAY_MINS / batchSize;

  if (!Number.isInteger(candlesPerDay)) {
    throw new Error(`getCandlesPerBatchDay: not round: ${DAY_MINS} / ${batchSize} = ${candlesPerDay}`);
  }

  return candlesPerDay;
};

const periodToMinutes = period => {
  const n = parseInt(period);
  if (!n) {
    throw new Error("periodToMinutes: error parsing n: " + n);
  }

  if (period.endsWith("d")) {
    return n * 1440;
  }
  if (period.endsWith("h")) {
    return n * 60;
  }
  if (period.endsWith("m")) {
    return n;
  }
  throw new Error("periodToMinutes: Unknown n/unit: " + period);
};

// period = string like 1d 1h 1m
const getCandlesPerPeriod = (period, batchSize) => {
  // batchSize in mins so nbeed to convert
  const mins = periodToMinutes(period);
  const candlesPerPeriod = mins / batchSize;

  if (!Number.isInteger(candlesPerPeriod)) {
    throw new Error(`getCandlesPerPeriod: not round: (period ${period}) ${mins} / ${batchSize} = ${candlesPerPeriod}`);
  }

  return candlesPerPeriod;
};

const validateSettings = (name, settings, props) => {
  for (let propName of props) {
    if (!settings[propName]) {
      throw new Error(`${name}: ${propName} not set`);
    }
  }
};

module.exports = {
  getDiffPercent,
  CandleBatcher2,
  XmBase,
  WaveManager,
  BatchWaveManager,
  valueToOHLC,
  round0,
  round2,
  spearson,
  getPctChange,
  max,
  Cooldown,
  CooldownXm,
  Queue,
  getCandlesPerBatchDay,
  getCandlesPerPeriod,
  validateSettings,
  batchCandlesInXs,
  batchIndInXs,
  makeid,
  timer,
  memorySizeOf,
  getAssetIdx
};
