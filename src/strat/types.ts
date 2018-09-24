import { PaperTrader } from "./gekko/PaperTrader";

export type Cb = (err: Error) => void;

export type CandleProp = "close" | "percentChange";

export interface Candle {
  start: number;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  vwp: number;
  trades: number;

  percentChange: number;
  pctChange60m: number;
  features?: number[];
  label?: number;
  ind?: Indicators;
}

export interface IndHlTrueRange {
  trueRange: number;
  valid: number;
  runningMax: number;
  runningMin: number;
}

export interface IndChannel {
  up: number;
  down: number;
}

export interface IndLRC {
  slope: number;
  intercept: number;
  result: number;
}

export interface BBands {
  upper: number;
  lower: number;
}

export interface MACD {
  signal: number;
  diff: number;
  histo: number;
}

export interface Indicators {
  rsi?: number;
  psar?: number;
  xmPsar?: number;
  hlTrueRange?: IndHlTrueRange;
  vixFix?: number;
  xmVixFix?: number;
  zlema60Fast?: number;
  zlema60Slow?: number;
  hma?: number;
  lrc60?: number;
  lrc120?: number;
  lrc240?: number;
  lrcChannel?: IndChannel;
  twiggs?: number;
  xmTwiggs?: number;
  kalman?: number;
  aroon?: IndChannel;
  mfi?: number;
  bbands?: BBands;
  macd60?: MACD;
  macd120?: MACD;
  macd240?: MACD;
  macd60_PSAR?: number;
  macdHistoLrc?: number;
  macdHistoLrcSlow?: number;
}

export type CsvCell = string | number;

export interface CoinData {
  name: string;
  candles: Candle[];
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
  reason: string;
}

export interface Report {
  startTime: Date;
  endTime: Date;
  timespan: string;
  market: number;

  balance: number;
  profit: number;
  relativeProfit: number;

  yearlyProfit: number;
  relativeYearlyProfit: number;

  startPrice: number;
  endPrice: number;
  trades: number;
  startBalance: number;
  exposure: number;
  sharpe: number;
  downside: number;
  alpha: number;
}

export interface RoundTrip {
  id: number;

  entryAt?: Date;
  entryPrice?: number;
  entryBalance?: number;

  exitAt?: Date;
  exitPrice?: number;
  exitBalance?: number;

  duration?: number;

  pnl?: number;
  profit?: number;

  exit?: RoundTripAction;
  entry?: RoundTripAction;
}

export interface RoundTripAction {
  date: Date;
  price: number;
  total: number;
}
