import * as Database from "better-sqlite3";
import { Candle, CoinList } from "./types";

export const queryCoins = (from: Date, to: Date): CoinList => {
  const dbBinance = new Database("../gekko-develop/history/binance_0.1.db");
  const dbKraken = new Database("../gekko-develop/history/kraken_0.1.db");
  const dbBitfinex = new Database("../gekko-develop/history/bitfinex_0.1.db");
  const dbPoloniex = new Database("../gekko-develop/history/poloniex_0.1.db");
  const dbGdax = new Database("../gekko-develop/history/gdax_0.1.db");

  const coins: CoinList = {
    BTC: {
      // a lot of things rely on coins.BTC so let's keep this here just for simplicity
      name: "BTC",
      candles: getCoin(dbKraken, "candles_USD_XBT", "BTC", from, to),
      buyAt: 0,
      color: "black"
    },
    BTC_KRK: {
      name: "BTC_KRK",
      candles: getCoin(dbKraken, "candles_USD_XBT", "BTC", from, to),
      buyAt: 0,
      color: "gray"
    },
    BTC_BNC: {
      name: "BTC_BNC",
      candles: getCoin(dbBinance, "candles_USDT_BTC", "BTC", from, to),
      buyAt: 0,
      color: "rgb(240, 185, 11)"
    },
    BTC_POL: {
      name: "BTC_BNC",
      candles: getCoin(dbPoloniex, "candles_USDT_BTC", "BTC", from, to),
      buyAt: 0,
      color: "#0a6970"
    },
    BTC_BFX: {
      name: "BTC_BFX",
      candles: getCoin(dbBitfinex, "candles_USD_BTC", "BTC", from, to),
      buyAt: 0,
      color: "#729d34"
    },
    BTC_GDX: {
      // don't have JUN yet, add later
      name: "BTC_GDX",
      candles: getCoin(dbGdax, "candles_USD_BTC", "BTC", from, to),
      buyAt: 0,
      color: "rgb(14, 125, 255)"
    }
  };
  return coins;
};

const getCoin = (
  db: Database,
  tableName: string,
  coinName: string,
  from: Date,
  to: Date
) => {
  return getCoinPercentDrop(db, tableName, coinName, from, to);
};

// const getCoinFull = (db: Database, tableName: string, coinName: string) => {
//   const rows = query(db, tableName, from, to);

//   const min = Math.min(...rows.map(x => x.close));
//   const max = Math.max(...rows.map(x => x.close));
//   for (let i = 0; i < rows.length; i++) {
//     const candle = rows[i];
//   }
//   return rows;
// };

// const getCoinCompact = (db: Database, tableName: string, coinName: string) => {
//   const rows = query(db, tableName, from, to);
//   // console.log("rowsEth", rows.length)
//   csvRows[0] = (csvRows[0] || []).concat([coinName]); // header
//   const min = Math.min(...rows.map(x => x.close));
//   const max = Math.max(...rows.map(x => x.close));
//   for (let i = 0; i < rows.length; i++) {
//     const candle = rows[i];

//     csvRows[i + 1] = (csvRows[i + 1] || []).concat([
//       rescale(candle.close, min, max)
//     ]);
//   }
//   return rows;
// };

const getCoinPercentDrop = (
  db: Database,
  tableName: string,
  coinName: string,
  from: Date,
  to: Date
) => {
  const rows = query(db, tableName, from, to);
  const max = Math.max(...rows.map(x => x.close));
  for (let i = 0; i < rows.length; i++) {
    const candle = rows[i];
    rows[i].percentChange = Math.round((candle.close / max) * 1000) / 1000;
  }
  return rows;
};

const query = (db: Database, table: string, from: Date, to: Date): Candle[] => {
  const fromTs = from.getTime() / 1000;
  const toTs = to.getTime() / 1000;
  const rows = db
    .prepare(
      `select * from ${table} where start >= ? and start <= ? order by start asc`
    )
    .all(fromTs, toTs);

  return rows as Candle[];
};
