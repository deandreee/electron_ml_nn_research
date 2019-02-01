import { PaperTrader } from "./gekko/PaperTrader";
import { CorrCandles } from "./corr/CorrCandles";
import { IndEMAOCC } from "./indicators/EMAOCC";
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
import { IndKeltner } from "./indicators/Keltner";
import { IndChandelierExit } from "./indicators/ChandelierExit";
import { IndKST } from "./indicators/KST";
import { IndATR } from "./indicators/ATR";
import { IndVWAP } from "./indicators/VWAP";
import { IndWilliamsR } from "./indicators/WilliamsR";
import { IndPSAR } from "./indicators/PSAR";
import { IndKalman } from "./indicators/Kalman";
import { IndSMA } from "./indicators/SMA";

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

export interface Barriers {
  [x: string]: number;
  PT_FIVE: number;
  ONE: number;
  TWO: number;
  THREE: number;
  FIVE: number;
}

export interface CandlePctChange {
  trippleBarrier?: number;
  doubleBarrier?: number;
  trippleBarriers?: Barriers;
  doubleBarriers?: Barriers;
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

export interface UpperLowerValue {
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

export interface VWAPValue {
  num: number;
  den: number;
}

export interface OCCValue {
  open: number;
  close: number;
  diff: number;
}

export interface Indicators {
  sma?: IndTimeframes<IndSMA>;
  rsi?: IndTimeframes<IndRSI>;

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

  cci?: number;

  volume60?: number;
  volume120?: number;

  ift?: IndTimeframes<IndIFT>;
  ifts?: IndTimeframes<IndIFTS>;

  stochKD?: IndTimeframes<IndStochKD>;
  bbands?: IndTimeframes<IndBBands>;
  keltner?: IndTimeframes<IndKeltner>;
  chandelierExit?: IndTimeframes<IndChandelierExit>;
  kst?: IndTimeframes<IndKST>;
  atr?: IndATR;
  vwap?: IndTimeframes<IndVWAP>;
  williamsR?: IndTimeframes<IndWilliamsR>;

  emaOCC?: IndTimeframes<IndEMAOCC>;
  t3Macd?: IndTimeframes<IndT3MACD>;
  zerolagT3?: IndTimeframes<IndZerolagT3>;
  lrc?: IndTimeframes<IndLRC>;

  macd?: IndTimeframes<IndMACD>;
  zerolagMACD?: IndTimeframes<IndZerolagMACD>;

  vixFix?: IndTimeframes<IndVixFix>;
  psar?: IndTimeframes<IndPSAR>;
  kalman?: IndTimeframes<IndKalman>;
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

export interface IndSettings {
  [x: string]: object;
}
