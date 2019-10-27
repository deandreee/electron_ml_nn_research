// taken from base6_jan2018
const coins = [
  { exchange: "kraken", currency: "USD", asset: "XBT" },
  { exchange: "kraken", currency: "USD", asset: "ETH" },
  { exchange: "kraken", currency: "USD", asset: "XRP" }, // 2017-05-18, a bit on the line
  { exchange: "kraken", currency: "USD", asset: "LTC" },
  { exchange: "kraken", currency: "USD", asset: "BCH" }, // 2017-08-01
  { exchange: "binance", currency: "USDT", asset: "BNB" }, // 2017-11-15

  // 7 TETHER

  { exchange: "kraken", currency: "USD", asset: "EOS" }, // 2018-02-16
  { exchange: "bitfinex", currency: "USD", asset: "BSV" }, // 2018-11-13
  { exchange: "kraken", currency: "USD", asset: "XLM" }, // 2018-02-17
  { exchange: "binance", currency: "USDT", asset: "ADA" }, // 2018-04-17
  { exchange: "bitfinex", currency: "USD", asset: "TRX" }, // 2018-01-26
  { exchange: "kraken", currency: "USD", asset: "XMR" },

  // 14 UNUS, only since Jun 20 in Bitfinex

  { exchange: "kraken", currency: "USD", asset: "DASH" },
  { exchange: "kraken", currency: "USD", asset: "XTZ" }, // 2018-10-16
  { exchange: "binance", currency: "USDT", asset: "NEO" }, // 2017-11-20
  { exchange: "binance", currency: "USDT", asset: "LINK" }, // 2019-01-16
  { exchange: "bitfinex", currency: "USD", asset: "IOT" }, // 2017-06-12 but VOLUME not enough

  // 20 Cosmos (ATOM) only since apr 20

  { exchange: "kraken", currency: "USD", asset: "ETC" },
  { exchange: "bitfinex", currency: "USD", asset: "MKR" }, // 2018-06-03

  // 23 NEM XEM never had the data

  { exchange: "binance", currency: "USDT", asset: "ONT" }, // 2018-06-08
  { exchange: "poloniex", currency: "USDT", asset: "ZEC" },
  { exchange: "kraken", currency: "USD", asset: "ZEC" },

  // 26 Crypto.com Chain (CRO) only shady exchanges
  // 27 USD Coin (USDC) - same as Tether
  // 28 V Systems VSYS - no volume basically

  { exchange: "bitfinex", currency: "USD", asset: "BTG" }, // 2018-04-30
  { exchange: "binance", currency: "USDT", asset: "QTUM" }, // 2018-05-01

  // 34 Decred (DCR) - shady exchanges only

  // ... no longer counting missing coins below this ...

  { exchange: "bitfinex", currency: "USD", asset: "OMG" }, // 2017-09-30, Volume ok
  { exchange: "bitfinex", currency: "USD", asset: "ZRX" }, // 2018-04-30
  { exchange: "binance", currency: "USDT", asset: "ICX" }, // 2018-06-15
  { exchange: "kraken", currency: "USD", asset: "REP" }, // 2016-10-04 => volume non existing
  { exchange: "bitfinex", currency: "USD", asset: "XVG" }, // 2018-05-10
  { exchange: "kraken", currency: "USD", asset: "GNO" }, // 2017-05-01 => volume non existing
  { exchange: "bitfinex", currency: "USD", asset: "QSH" }, // 2018-04-30
];

const getAssetIdx = asset => {
  if (asset === "BTC") {
    return 1;
  }

  const idx = coins.findIndex(x => x.asset === asset);

  if (idx >= 0) {
    return idx + 1;
  }

  return "NaN";
};

module.exports = {
  getAssetIdx,
};
