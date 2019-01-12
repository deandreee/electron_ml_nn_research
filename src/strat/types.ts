import { PaperTrader } from "./gekko/PaperTrader";
import { CorrCandles } from "./corr/CorrCandles";
import { IndEMAxOCC } from "./indicators/EMAxOCC";
import { IndT3MACD } from "./indicators/T3MACD";
import { IndZerolagT3 } from "./indicators/ZerolagT3";
import { IndTimeframes } from "./indicators/IndTimeframeGroup";
import { IndLRC } from "./indicators/LRC";
import { IndZerolagMACD } from "./indicators/ZerolagMACD";
import { IndMACD } from "./indicators/MACD";
import { IndVixFix } from "./indicators/VixFix";
import { IndStochKD } from "./indicators/StochKD";
import { IndMFI } from "./indicators/MFI";
import { IndBBands } from "./indicators/BBands";
import { IndRSI } from "./indicators/RSI";
import { IndIFT } from "./indicators/IFT";
import { IndIFTS } from "./indicators/IFTS";

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
  _4d: number[];
  _7d: number[];
  _10d: number[];
}

export interface TrippleBarriers {
  [x: string]: number;
  ptFive: number;
  one: number;
  two: number;
  three: number;
  five: number;
}

export interface CandlePctChange {
  trippleBarrier?: number;
  trippleBarriers?: TrippleBarriers;
  _10m?: number;
  _60m?: number;
  _120m?: number;
  _240m?: number;
  _480m?: number;
  _1d?: number;
  _2d?: number;
  _4d?: number;
  _7d?: number;
  _10d?: number;
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

export interface IndLRCValue {
  slope: number;
  intercept: number;
  result: number;
}

export interface BBandsValue {
  upper: number;
  lower: number;
}

export interface MACDValue {
  signal: number;
  diff: number;
  histo: number;
}

export interface PSAR {
  result: number;
  trend: "up" | "down";
  trendLength: number;
}

export interface StochKDValue {
  k: number;
  d: number;
}

export interface VWAP {
  num: number;
  den: number;
}

export interface Indicators {
  rsi?: IndTimeframes<IndRSI>;

  psar?: number;
  xmPsar?: number;
  hlTrueRange?: IndHlTrueRange;

  zlema60Fast?: number;
  zlema60Slow?: number;
  hma?: number;
  lrc1?: IndLRCValue;
  lrc10?: IndLRCValue;
  lrc30?: IndLRCValue;
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

  mfi?: IndTimeframes<IndMFI>;

  macd60_PSAR?: PSAR;

  macdHistoLrc?: number;
  macdHistoLrcSlow?: number;

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

  ift?: IndTimeframes<IndIFT>;
  ifts?: IndTimeframes<IndIFTS>;

  stochKD?: IndTimeframes<IndStochKD>;
  bbands?: IndTimeframes<IndBBands>;

  vwap30_10?: VWAP;
  vwap30_20?: VWAP;
  vwap30_30?: VWAP;

  vwap60_10?: VWAP;
  vwap60_20?: VWAP;
  vwap60_30?: VWAP;

  vwap120_10?: VWAP;
  vwap120_20?: VWAP;
  vwap120_30?: VWAP;

  vwap240_10?: VWAP;
  vwap240_20?: VWAP;
  vwap240_30?: VWAP;

  emaOCC?: IndTimeframes<IndEMAxOCC>;
  t3Macd?: IndTimeframes<IndT3MACD>;
  zerolagT3?: IndTimeframes<IndZerolagT3>;
  lrc?: IndTimeframes<IndLRC>;

  macd?: IndTimeframes<IndMACD>;
  zerolagMACD?: IndTimeframes<IndZerolagMACD>;

  vixFix?: IndTimeframes<IndVixFix>;
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
  IOT = "IOT",
  TRX = "TRX",
  XMR = "XMR",
  NEO = "NEO",
  DASH = "DASH",
  ETC = "ETC",
  BNB = "BNB",
  VEN = "VEN",
  ZEC = "ZEC",
  QTUM = "QTUM",
  OMG = "OMG",
  ZRX = "ZRX"
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

export interface RunResult {
  coin: CorrCandles;
  labelsPredicted: number[];
  linRegs: LinRegResult[];
}

export interface LinRegResult {
  x: number[];
  y: number[];
  regEquation: number[];
  r2: number;
  corr: number;
  name: string;
}
