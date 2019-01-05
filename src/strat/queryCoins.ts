import { Coins, CoinData } from "./types";
import { DB, dbQuery } from "./getDb";

interface CoinQuery {
  name: string;
  db: DB;
  tableName: string;
  color: string;
}

const COIN_QUERIES: { [name: string]: CoinQuery } = {
  // switch to binance because empty/missing between Nov4 and Nov14
  // BTC: {
  //   name: "BTC",
  //   db: DB.KRAKEN,
  //   tableName: "candles_USD_XBT",
  //   color: "#F7931A"
  // },
  BTC: {
    name: "BTC",
    db: DB.BINANCE,
    tableName: "candles_USDT_BTC",
    color: "#F7931A"
  },
  ETH: {
    name: "ETH",
    db: DB.KRAKEN,
    tableName: "candles_USD_ETH",
    color: "#282828"
  },
  XRP: {
    name: "XRP",
    db: DB.KRAKEN,
    tableName: "candles_USD_XRP",
    color: "#346AA9"
  },
  BCC: {
    name: "BCC",
    db: DB.BINANCE,
    tableName: "candles_USDT_BCC",
    color: "#4cca47"
  },
  EOS: {
    name: "EOS",
    db: DB.KRAKEN,
    tableName: "candles_USD_EOS",
    color: "#19191A"
  },
  XLM: {
    name: "XLM",
    db: DB.KRAKEN,
    tableName: "candles_USD_XLM",
    color: "#08B5E5"
  },
  LTC: {
    name: "LTC",
    db: DB.KRAKEN,
    tableName: "candles_USD_LTC",
    color: "#838383"
  },
  ADA: {
    name: "ADA",
    db: DB.BINANCE,
    tableName: "candles_USDT_ADA",
    color: "#3CC8C8"
  },
  IOT: {
    name: "IOT",
    db: DB.BITFINEX,
    tableName: "candles_USD_IOT",
    color: "#FFFFFF"
  },

  TRX: {
    name: "TRX",
    db: DB.BITFINEX,
    tableName: "candles_USD_TRX",
    color: "#396a74"
  },

  XMR: {
    name: "XMR",
    db: DB.KRAKEN,
    tableName: "candles_USD_XMR",
    color: "#FF6600"
  },

  NEO: {
    name: "NEO",
    db: DB.BINANCE,
    tableName: "candles_USDT_NEO",
    color: "#58BF00"
  },

  DASH: {
    name: "DASH",
    db: DB.KRAKEN,
    tableName: "candles_USD_DASH",
    color: "#1c75bc"
  },

  ETC: {
    name: "ETC",
    db: DB.KRAKEN,
    tableName: "candles_USD_ETC",
    color: "#669073"
  },
  BNB: {
    name: "BNB",
    db: DB.BINANCE,
    tableName: "candles_USDT_BNB",
    color: "#edba2d"
  },

  VEN: {
    name: "VEN",
    db: DB.BITFINEX,
    tableName: "candles_USD_VEN",
    color: "#42AFB2"
  },

  ZEC: {
    name: "ZEC",
    db: DB.POLONIEX,
    tableName: "candles_USDT_ZEC",
    color: "#e5a93d"
  },

  QTUM: {
    name: "QTUM",
    db: DB.BINANCE,
    tableName: "candles_USDT_QTUM",
    color: "#359BCE"
  },

  OMG: {
    name: "OMG",
    db: DB.BITFINEX,
    tableName: "candles_USD_OMG",
    color: "#1A53F0"
  },

  ZRX: {
    name: "ZRX",
    db: DB.BITFINEX,
    tableName: "candles_USD_ZRX",
    color: "black"
  }
};

export const queryCoin = (coin: Coins, from: Date, to: Date): CoinData => {
  const coinQuery = COIN_QUERIES[coin];
  return {
    name: coinQuery.name,
    color: "#F7931A",
    candles: dbQuery(coinQuery.db, coinQuery.tableName, coinQuery.name, from, to)
  };
};
