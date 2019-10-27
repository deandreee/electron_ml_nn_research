const Database = require("better-sqlite3");
const util = require("../../core/util");
const ENV = util.gekkoEnv();

const getPriceMinMax = config => {
  const path =
    ENV === "child-process"
      ? `../history/${config.watch.exchange}_0.1.db`
      : `./history/${config.watch.exchange}_0.1.db`;

  const db = new Database(path);

  let { from, to } = config.backtest.daterange;
  to = to || new Date().toISOString();
  const tableName = `candles_${config.watch.currency}_${config.watch.asset}`;

  const fromTs = new Date(from).getTime() / 1000;
  const toTs = new Date(to).getTime() / 1000;
  const rows = db
    .prepare(
      `select * from ${tableName} where start >= ? and start <= ? order by start asc`
    )
    .all(fromTs, toTs);

  // console.log("getPriceMinMax", rows.length);

  const max = getMax(rows, "close");
  const min = getMin(rows, "close");

  const maxVol = getMax(rows, "volume");
  const minVol = getMin(rows, "volume");

  const maxTrades = getMax(rows, "trades");
  const minTrades = getMin(rows, "trades");

  const res = { min, max, maxVol, minVol, maxTrades, minTrades };
  validate(res);
  return res;
};

const validate = res => {
  const { min, max, maxVol, minVol, maxTrades, minTrades } = res;

  if (min === null || min === undefined) {
    throw new Error("getPriceMinMax: min null");
  }

  if (max === null || max === undefined) {
    throw new Error("getPriceMinMax: max null");
  }

  if (min === max) {
    throw new Error("getPriceMinMax: min = max");
  }

  if (maxVol === null || maxVol === undefined) {
    throw new Error("getPriceMinMax: maxVol null");
  }

  if (minVol === null || minVol === undefined) {
    throw new Error("getPriceMinMax: minVol null");
  }

  if (minVol === maxVol) {
    throw new Error("getPriceMinMax: minVol = maxVol");
  }

  if (minTrades === null || minTrades === undefined) {
    throw new Error("getPriceMinMax: minTrades null");
  }

  if (maxTrades === null || maxTrades === undefined) {
    throw new Error("getPriceMinMax: maxTrades null");
  }

  if (minTrades === maxTrades) {
    throw new Error("getPriceMinMax: minTrades = maxTrades");
  }
};

const getMax = (rows, propName) => {
  let max = rows[0][propName];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][propName] > max) {
      max = rows[i][propName];
    }
  }
  return max;
};

const getMin = (rows, propName) => {
  let min = rows[0][propName];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][propName] < min) {
      min = rows[i][propName];
    }
  }
  return min;
};

const rescale = (value, min, max, newMin, newMax) => {
  return ((newMax - newMin) / (max - min)) * (value - max) + newMax;
};

function descale(normalized, min, max) {
  return normalized * (max - min) + min;
}

module.exports.getPriceMinMax = getPriceMinMax;
module.exports.rescale = rescale;
module.exports.descale = descale;
