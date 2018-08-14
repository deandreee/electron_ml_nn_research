import { PaperTrader } from "./gekko/PaperTrader";

export type Cb = (err: Error) => void;

export interface Candle {
  start: number;
  close: number;
  volume: number;
  percentChange: number;
  pctChange60m: number;
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
  trader?: PaperTrader;
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

export interface Portfolio {
  currency: number;
  asset: number;
}

export type Advice = "short" | "long";

export interface AdviceObj {
  id: string;
  date: Date;
  recommendation: Advice;
}

export interface Trade {
  action: "buy" | "sell";
  date: Date;
  price: number;
  portfolio: Portfolio;
  balance: number;
  candle: Candle;
}

export interface Report {
  trades: Trade[];
}
