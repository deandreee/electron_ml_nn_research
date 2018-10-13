import { PaperTrader } from "./gekko/PaperTrader";

export type Cb = (err: Error) => void;

export type CandleProp = "close" | "percentChange";

export interface PctChange {
  _10m: number[];
  _60m: number[];
  _120m: number[];
  _240m: number[];
  _480m: number[];
  _1d: number[];
  _2d: number[];
  _7d: number[];
}

export interface CandlePctChange {
  _10m: number;
  _60m: number;
  _120m: number;
  _240m: number;
  _480m: number;
  _1d: number;
  _2d: number;
  _7d: number;
}

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

  pctChange: CandlePctChange;

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

export interface PSAR {
  result: number;
  trend: "up" | "down";
  trendLength: number;
}

export interface StochKD {
  k: number;
  d: number;
}

export interface Indicators {
  rsi30x10?: number;
  rsi60x10?: number;
  rsi60x20?: number;
  rsi120x10?: number;
  psar?: number;
  xmPsar?: number;
  hlTrueRange?: IndHlTrueRange;
  vixFix30?: number;
  vixFix60?: number;
  vixFix120?: number;
  zlema60Fast?: number;
  zlema60Slow?: number;
  hma?: number;
  lrc1?: IndLRC;
  lrc10?: IndLRC;
  lrc30?: IndLRC;
  lrc60?: number;
  lrc120?: number;
  lrc240?: number;
  lrc30_PSAR?: PSAR;
  lrc60_PSAR?: PSAR;
  lrcChannel?: IndChannel;
  lrc1_pred?: number;
  lrc10_pred?: number;
  twiggs?: number;
  xmTwiggs?: number;
  kalman?: number;
  aroon?: IndChannel;
  mfi60_15?: number;
  mfi60_30?: number;
  mfi60_60?: number;
  mfi120_15?: number;
  mfi120_30?: number;
  mfi120_60?: number;
  bbands?: BBands;
  macd30?: MACD;
  macd60?: MACD;
  macd60_PSAR?: PSAR;
  macd120?: MACD;
  macd240?: MACD;
  macdHistoLrc?: number;
  macdHistoLrcSlow?: number;
  zerlagMacd60?: MACD;
  zerlagMacd120?: MACD;
  macd60_ADX30?: number;
  macd60_ADX60?: number;
  macd60_ADX120?: number;
  macd120_ADX30?: number;
  macd120_ADX60?: number;
  macd120_ADX120?: number;
  atr60?: number;
  atr120?: number;
  atr240?: number;
  atr360?: number;
  atr480?: number;
  atr720?: number;
  atr960?: number;
  cci?: number;

  volume60?: number;
  volume120?: number;

  ift30x5?: number;
  ift60x5?: number;
  ift60x15?: number;
  ift10x15?: number;
  ift30x15?: number;
  ift120x15?: number;
  ift10x30?: number;
  ift60x30?: number;
  ift120x30?: number;

  ifts10x15?: number;
  ifts30x15?: number;
  ifts60x15?: number;

  stochKD?: StochKD;
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
