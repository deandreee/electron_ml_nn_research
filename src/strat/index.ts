import * as Database from "better-sqlite3";
import * as bluebird from "bluebird";
import * as SVM from "svm";
// const sxm = require("svm");
import { makeid } from "./makeid";
// import * as fs from "fs";
// import * as csv from "csv";
import { Candle, Cb, CoinData, Coins, CsvCell, CoinList } from "./types";
// import { strat1 } from "./strat1";
import { vol1 } from "./vol1";
import * as ms from "ms";

const csvRows: (CsvCell)[][] = [];
let buyAt: Date = null;

// wow both down and up
// const from = new Date("2018-05-24T00:00:00.000Z");
// const to = new Date("2018-05-25T00:00:00.000Z");
// 15:47

// pump weird small drops in a day, then shoots up straight up in 3m
const from = new Date("2018-06-02T00:00:00.000Z");
const to = new Date("2018-06-03T00:00:00.000Z");

// dump
// const from = new Date("2018-06-10T00:00:00.000Z");
// const from = new Date("2018-06-09T22:00:00.000Z"); // actually starts around 17:00
// const to = new Date("2018-06-10T12:00:00.000Z");

// very gradual, first signs around 07:36
// const buyAt = new Date("2018-07-24T07:36:00.000Z");
// const buyAt = new Date("2018-07-24T04:00:00.000Z");
// const from = new Date("2018-07-24T00:00:00.000Z");
// const to = new Date("2018-07-25T00:00:00.000Z");

// const buyAt = new Date("2018-07-29T04:00:00.000Z");
// const from = new Date("2018-07-25T00:00:00.000Z");
// const to = new Date("2018-07-26T00:00:00.000Z");

const fromExtended = new Date(from.getTime() - ms("1h"));
const toExtended = new Date(to.getTime() + ms("1h"));

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
const fileName = `./results/${
  MONTH_NAMES[from.getMonth()]
}${from.getDate()}_${makeid(6)}.csv`;

export const run = (): CoinList => {
  const dbBinance = new Database("../gekko-develop/history/binance_0.1.db");
  const dbKraken = new Database("../gekko-develop/history/kraken_0.1.db");
  const dbBitfinex = new Database("../gekko-develop/history/bitfinex_0.1.db");
  const dbPoloniex = new Database("../gekko-develop/history/poloniex_0.1.db");

  const coins: CoinList = {
    BTC: {
      name: "BTC",
      candles: getCoin(dbKraken, "candles_USD_XBT", "BTC"),
      buyAt: 0,
      color: "#F7931A"
    },
    ETH: {
      name: "ETH",
      candles: getCoin(dbKraken, "candles_USD_ETH", "ETH"),
      buyAt: 0,
      color: "#282828"
    },
    XRP: {
      name: "XRP",
      candles: getCoin(dbKraken, "candles_USD_XRP", "XRP"),
      buyAt: 0,
      color: "#346AA9"
    },
    BCC: {
      name: "BCC",
      candles: getCoin(dbBinance, "candles_USDT_BCC", "BCC"),
      buyAt: 0,
      color: "#4cca47"
    },
    EOS: {
      name: "EOS",
      candles: getCoin(dbKraken, "candles_USD_EOS", "EOS"),
      buyAt: 0,
      color: "#19191A"
    },
    XLM: {
      name: "XLM",
      candles: getCoin(dbKraken, "candles_USD_XLM", "XLM"),
      buyAt: 0,
      color: "#08B5E5"
    },
    LTC: {
      name: "LTC",
      candles: getCoin(dbKraken, "candles_USD_LTC", "LTC"),
      buyAt: 0,
      color: "#838383"
    },
    ADA: {
      name: "ADA",
      candles: getCoin(dbBinance, "candles_USDT_ADA", "ADA"),
      buyAt: 0,
      color: "#3CC8C8"
    },
    IOT: {
      name: "IOT",
      candles: getCoin(dbBitfinex, "candles_USD_IOT", "IOT"),
      buyAt: 0,
      color: "#FFFFFF"
    },
    TRX: {
      name: "TRX",
      candles: getCoin(dbBitfinex, "candles_USD_TRX", "TRX"),
      buyAt: 0,
      color: "#396a74"
    },
    XMR: {
      name: "XMR",
      candles: getCoin(dbKraken, "candles_USD_XMR", "XMR"),
      buyAt: 0,
      color: "#FF6600"
    },
    NEO: {
      name: "NEO",
      candles: getCoin(dbBinance, "candles_USDT_NEO", "NEO"),
      buyAt: 0,
      color: "#58BF00"
    },
    DASH: {
      name: "DASH",
      candles: getCoin(dbKraken, "candles_USD_DASH", "DASH"),
      buyAt: 0,
      color: "#1c75bc"
    },
    ETC: {
      name: "ETC",
      candles: getCoin(dbKraken, "candles_USD_ETC", "ETC"),
      buyAt: 0,
      color: "#669073"
    },
    BNB: {
      name: "BNB",
      candles: getCoin(dbBinance, "candles_USDT_BNB", "BNB"),
      buyAt: 0,
      color: "#edba2d"
    },
    VEN: {
      name: "VEN",
      candles: getCoin(dbBitfinex, "candles_USD_VEN", "VEN"),
      buyAt: 0,
      color: "#42AFB2"
    },
    ZEC: {
      name: "ZEC",
      candles: getCoin(dbPoloniex, "candles_USDT_ZEC", "ZEC"),
      buyAt: 0,
      color: "#e5a93d"
    },
    QTUM: {
      name: "QTUM",
      candles: getCoin(dbBinance, "candles_USDT_QTUM", "QTUM"),
      buyAt: 0,
      color: "#359BCE"
    },
    OMG: {
      name: "OMG",
      candles: getCoin(dbBitfinex, "candles_USD_OMG", "OMG"),
      buyAt: 0,
      color: "#1A53F0"
    },
    ZRX: {
      name: "ZRX",
      candles: getCoin(dbBitfinex, "candles_USD_ZRX", "ZRX"),
      buyAt: 0,
      color: "black" // fix later
    }
  };

  vol1(coins, buyAt);

  const svm = new SVM.SVM();
  const candlesActual = coins.BTC.candles.filter(
    x => x.start * 1000 >= from.getTime() && x.start * 1000 <= to.getTime()
  );
  const data = candlesActual.map(x => x.features);
  const labels = candlesActual.map(x => x.label);
  svm.train(data, labels);

  return coins;

  //   let str = await bluebird.fromCallback((cb: Cb) => csv.stringify(csvRows, cb));
  //   await bluebird.fromCallback((cb: Cb) => fs.appendFile(fileName, str, cb));
  //   console.log("csv.stringify done");
};

const getCoin = (db: Database, tableName: string, coinName: string) => {
  return getCoinPercentDrop(db, tableName, coinName);
};

const getCoinFull = (db: Database, tableName: string, coinName: string) => {
  const rows = query(db, tableName, from, to);
  // console.log("rowsEth", rows.length)
  csvRows[0] = (csvRows[0] || []).concat([
    "start",
    `${coinName} original`,
    coinName,
    `${coinName} vol`
  ]); // header
  const min = Math.min(...rows.map(x => x.close));
  const max = Math.max(...rows.map(x => x.close));
  for (let i = 0; i < rows.length; i++) {
    const candle = rows[i];
    csvRows[i + 1] = (csvRows[i + 1] || []).concat([
      candle.start,
      candle.close,
      rescale(candle.close, min, max),
      candle.volume
    ]);
  }
  return rows;
};

const getCoinCompact = (db: Database, tableName: string, coinName: string) => {
  const rows = query(db, tableName, from, to);
  // console.log("rowsEth", rows.length)
  csvRows[0] = (csvRows[0] || []).concat([coinName]); // header
  const min = Math.min(...rows.map(x => x.close));
  const max = Math.max(...rows.map(x => x.close));
  for (let i = 0; i < rows.length; i++) {
    const candle = rows[i];

    csvRows[i + 1] = (csvRows[i + 1] || []).concat([
      rescale(candle.close, min, max)
    ]);
  }
  return rows;
};

const getCoinPercentDrop = (
  db: Database,
  tableName: string,
  coinName: string
) => {
  const rows = query(db, tableName, from, to);
  // console.log("rowsEth", rows.length)
  csvRows[0] = (csvRows[0] || []).concat([coinName, `${coinName} %`]); // header
  const min = Math.min(...rows.map(x => x.close));
  const max = Math.max(...rows.map(x => x.close));
  for (let i = 0; i < rows.length; i++) {
    const candle = rows[i];
    csvRows[i + 1] = (csvRows[i + 1] || []).concat([
      candle.close,
      candle.close / max
    ]);
    rows[i].percentChange = Math.round((candle.close / max) * 1000) / 1000;
  }
  return rows;
};

// https://stats.stackexchange.com/questions/70801/how-to-normalize-data-to-0-1-range
// newvalue= (max'-min')/(max-min)*(value-max)+max'
// min' to max' => new
const rescale = (value: number, min: number, max: number): number => {
  const newMin = 0;
  const newMax = 100;
  return ((newMax - newMin) / (max - min)) * (value - max) + newMax;
};

const query = (db: Database, table: string, from: Date, to: Date): Candle[] => {
  const fromTs = fromExtended.getTime() / 1000;
  const toTs = toExtended.getTime() / 1000;
  const rows = db
    .prepare(
      `select * from ${table} where start >= ? and start <= ? order by start asc`
    )
    .all(fromTs, toTs);

  return rows as Candle[];
};
