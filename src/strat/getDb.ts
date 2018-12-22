import * as Database from "better-sqlite3";
import { Candle } from "./types";

export enum DB {
  KRAKEN = "KRAKEN",
  BINANCE = "BINANCE",
  BITFINEX = "BITFINEX",
  POLONIEX = "POLONIEX"
}

const dbCache: { [name: string]: Database } = {};

export const getDb = (db: DB) => {
  if (db === DB.KRAKEN) {
    if (!dbCache[DB.KRAKEN]) {
      const db = new Database("../gekko-develop/history/kraken_0.1.db");
      dbCache[DB.KRAKEN] = db;
    }
    return dbCache[DB.KRAKEN];
  }

  if (db === DB.BINANCE) {
    if (!dbCache[DB.BINANCE]) {
      const db = new Database("../gekko-develop/history/binance_0.1.db");
      dbCache[DB.BINANCE] = db;
    }
    return dbCache[DB.BINANCE];
  }

  if (db === DB.BITFINEX) {
    if (!dbCache[DB.BITFINEX]) {
      const db = new Database("../gekko-develop/history/bitfinex_0.1.db");
      dbCache[DB.BITFINEX] = db;
    }
    return dbCache[DB.BITFINEX];
  }

  if (db === DB.POLONIEX) {
    if (!dbCache[DB.POLONIEX]) {
      const db = new Database("../gekko-develop/history/poloniex_0.1.db");
      dbCache[DB.POLONIEX] = db;
    }
    return dbCache[DB.POLONIEX];
  }

  throw new Error(`DB not found: ${db}`);
};

export const dbQuery = (dbName: DB, tableName: string, coinName: string, from: Date, to: Date) => {
  const db = getDb(dbName);
  // return getCoinPercentDrop(db, tableName, coinName, from, to);
  return query(db, tableName, from, to);
};

// const getCoinPercentDrop = (db: Database, tableName: string, coinName: string, from: Date, to: Date) => {
//   const rows = query(db, tableName, from, to);
//   const max = Math.max(...rows.map(x => x.close));
//   for (let i = 0; i < rows.length; i++) {
//     const candle = rows[i];
//     rows[i].percentChange = Math.round((candle.close / max) * 1000) / 1000;
//   }
//   return rows;
// };

const query = (db: Database, table: string, from: Date, to: Date): Candle[] => {
  const fromTs = from.getTime() / 1000;
  const toTs = to.getTime() / 1000;
  const rows = db
    .prepare(`select * from ${table} where start >= ? and start <= ? order by start asc`)
    .all(fromTs, toTs);

  return rows as Candle[];
};