import * as Database from "better-sqlite3";
import { Candle, CoinList } from "./types";

export const queryCoins = (from: Date, to: Date): CoinList => {
  const dbBinance = new Database("../gekko-develop/history/binance_0.1.db");
  const dbKraken = new Database("../gekko-develop/history/kraken_0.1.db");
  const dbBitfinex = new Database("../gekko-develop/history/bitfinex_0.1.db");
  const dbPoloniex = new Database("../gekko-develop/history/poloniex_0.1.db");

  const coins: CoinList = {
    BTC: {
      name: "BTC",
      candles: getCoin(dbKraken, "candles_USD_XBT", "BTC", from, to),

      color: "#F7931A"
    },
    ETH: {
      name: "ETH",
      candles: getCoin(dbKraken, "candles_USD_ETH", "ETH", from, to),

      color: "#282828"
    },
    XRP: {
      name: "XRP",
      candles: getCoin(dbKraken, "candles_USD_XRP", "XRP", from, to),

      color: "#346AA9"
    },
    BCC: {
      name: "BCC",
      candles: getCoin(dbBinance, "candles_USDT_BCC", "BCC", from, to),

      color: "#4cca47"
    },
    EOS: {
      name: "EOS",
      candles: getCoin(dbKraken, "candles_USD_EOS", "EOS", from, to),

      color: "#19191A"
    },
    XLM: {
      name: "XLM",
      candles: getCoin(dbKraken, "candles_USD_XLM", "XLM", from, to),

      color: "#08B5E5"
    },
    LTC: {
      name: "LTC",
      candles: getCoin(dbKraken, "candles_USD_LTC", "LTC", from, to),

      color: "#838383"
    },
    ADA: {
      name: "ADA",
      candles: getCoin(dbBinance, "candles_USDT_ADA", "ADA", from, to),

      color: "#3CC8C8"
    },
    // IOT: {
    //   name: "IOT",
    //   candles: getCoin(dbBitfinex, "candles_USD_IOT", "IOT", from, to),

    //   color: "#FFFFFF"
    // },
    // TRX: {
    //   name: "TRX",
    //   candles: getCoin(dbBitfinex, "candles_USD_TRX", "TRX", from, to),

    //   color: "#396a74"
    // },
    // XMR: {
    //   name: "XMR",
    //   candles: getCoin(dbKraken, "candles_USD_XMR", "XMR", from, to),

    //   color: "#FF6600"
    // },
    // NEO: {
    //   name: "NEO",
    //   candles: getCoin(dbBinance, "candles_USDT_NEO", "NEO", from, to),

    //   color: "#58BF00"
    // },
    DASH: {
      name: "DASH",
      candles: getCoin(dbKraken, "candles_USD_DASH", "DASH", from, to),

      color: "#1c75bc"
    }
    // ETC: {
    //   name: "ETC",
    //   candles: getCoin(dbKraken, "candles_USD_ETC", "ETC", from, to),

    //   color: "#669073"
    // },
    // BNB: {
    //   name: "BNB",
    //   candles: getCoin(dbBinance, "candles_USDT_BNB", "BNB", from, to),

    //   color: "#edba2d"
    // },
    // VEN: {
    //   name: "VEN",
    //   candles: getCoin(dbBitfinex, "candles_USD_VEN", "VEN", from, to),

    //   color: "#42AFB2"
    // },
    // ZEC: {
    //   name: "ZEC",
    //   candles: getCoin(dbPoloniex, "candles_USDT_ZEC", "ZEC", from, to),

    //   color: "#e5a93d"
    // },
    // QTUM: {
    //   name: "QTUM",
    //   candles: getCoin(dbBinance, "candles_USDT_QTUM", "QTUM", from, to),

    //   color: "#359BCE"
    // },
    // OMG: {
    //   name: "OMG",
    //   candles: getCoin(dbBitfinex, "candles_USD_OMG", "OMG", from, to),

    //   color: "#1A53F0"
    // },
    // ZRX: {
    //   name: "ZRX",
    //   candles: getCoin(dbBitfinex, "candles_USD_ZRX", "ZRX", from, to),

    //   color: "black" // fix later
    // }
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
