const MFI = require("./MFI");
const BB = require("./BB");
const MACD = require("./MACD");
const PSAR_TI = require("./PSAR_TI");
const PSARProps = require("./PSARProps");
const RSI = require("./RSI");
const LRC = require("./LRC");
// const BBands = require("./BB"); // broken
const BBands = require("./BB3_TI");
const VixFix = require("./VixFix");
const ATR = require("./ATR");
const CCI = require("./CCI");
const ADX = require("./ADX");
const ROC = require("./ROC");
const SMA = require("./SMA");
const LRCPred = require("./LRCPred");
const StochKD = require("./StochKD");
const EMA = require("./EMA");
const KeltnerChannels = require("./KeltnerChannels");
const ChandelierExit = require("./ChandelierExit");
const KST = require("./KST");
const WilliamsR = require("./WilliamsR");
const Kalman = require("./Kalman");
const EMAOCC = require("./EMAOCC");

module.exports = {
  MFI,
  BB,
  MACD,
  PSAR_TI,
  PSARProps,
  RSI,
  LRC,
  BBands,
  VixFix,
  ATR,
  CCI,
  ADX,
  ROC,
  SMA,
  LRCPred,
  StochKD,
  EMA,
  KeltnerChannels,
  ChandelierExit,
  KST,
  WilliamsR,
  Kalman,
  EMAOCC,
};
