export type Cb = (err: Error) => void;

export interface Candle {
  start: number;
  close: number;
  volume: number;
  percentChange: number;
  features?: number[];
  label?: number;
}

export type CsvCell = string | number;

export interface CoinData {
  name: string;
  candles: Candle[];
  buyAt: number;
  buyAtTs?: number;
  buyAtIdx?: number;
  buyAtProfit?: number;
  profitLast?: number;
  profitMax?: number;
  color?: string;
}

export enum Coins {
  BTC = "BTC",
  ETH = "ETH",
  XRP = "XRP",
  BCC = "BCC",
  EOS = "EOS",
  XLM = "XLM",
  LTC = "LTC",
  ADA = "ADA",
  IOT = "IOT"
}

// export type CoinList = HashMap<Coins, CoinData>;
// = {
//   [key in keyof typeof Coins]: CoinData
//   // BTC: CoinData;
//   // ETH: CoinData;
//   // XRP: CoinData;
//   // BCC: CoinData;
//   // EOS: CoinData;
//   // XLM: CoinData;
//   // LTC: CoinData;
//   // ADA: CoinData;
//   // IOT: CoinData;
// };

// export type CoinList = { [key in keyof typeof Coins]: CoinData };
export type CoinList = { [key: string]: CoinData };

type HashMap<K extends Coins, V> = { [k in K]: V };
