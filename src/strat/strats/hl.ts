import { CoinList, CoinData, AdviceObj, Candle } from "../types";
import { massBuy, massSell } from "../massTrade";
import { config } from "../config";

// let barscount = 0; // ask: not used
// let DarvasHigh = 0; // ask: not used
// let DarvasLow = 0; // ask: not used

/*** mounir: calculate down peak and trade on ***/

let candle_queue: Candle[] = []; // ask: yeah well this is weird, uses last 25 and clears when buying ...
let is_buyin = false;

// let Min: number[] = []; // ask: not used anywhere
// let runningMinArr: number[] = []; // ask: not used anywhere
// let movingTrueRange: number[] = []; // ask: movingTR previously, pointless, not used for anything
let NoTradedSince = 0;

export const check = (coins: CoinList, i: number) => {
  const prevCandle = coins[config.leadCoin].candles[i - 1];
  const candle = coins[config.leadCoin].candles[i];
  candle_queue.push(candle);

  checkReal(coins, candle, i);
};

const getRunningMax = () => {
  const barsBack = Math.min(candle_queue.length, period - 1);
  let max = 0;
  for (let i = barsBack; i > 0; i--) {
    if (candle_queue[i].close > max) {
      max = candle_queue[i].close;
    }
  }
  return max;
};

const getRunningMin = () => {
  const barsBack = Math.min(candle_queue.length, period - 1);
  let min = Infinity;
  for (let i = barsBack; i > 0; i--) {
    if (candle_queue[i].close < min) {
      min = candle_queue[i].close;
    }
  }
  return min;
};

const getPrevCandle = () => {
  return candle_queue[candle_queue.length - 2];
};

const period = 25; // settings
const checkReal = (coins: CoinList, candle: Candle, i: number) => {
  // ask: just wait until we have enough candles
  if (candle_queue.length < period) {
    return;
  }

  // Get running Min/Max for period (-X candles)
  // ask: one thing, don't look at current candle
  // sheaaaat I was wondering how it didnt take last candle
  // originally it uses min(length, this.settings.Period - 1), that's where last candle is filtered
  let runningMin = getRunningMin();
  let runningMax = getRunningMax();

  // ask: is candle lower than what we have seen in prev period
  // fkin great false or number, less do it
  // by how much % | no I don't get this
  const candeLow =
    candle.close < runningMin && (candle.close - runningMin) / 100;
  //   MoveCycle.push(candeLow); // ask: MoveCycle not used

  // ask: diff between min/max including current candle
  const c1 = getPrevCandle();

  // I don't get this, what is true range? ATR?
  // ask: since c1 included un calculations, I dont see the point of max/min
  // oh it's not, when candle_queue.length 25+, so there are possible candles that are not in min/max calculations ... amazing logic
  const trueRange =
    Math.max(runningMax, c1.close) - Math.min(runningMin, c1.close);

  // and this is even better
  const valid = trueRange / (candle.close - c1.close);

  if (candeLow && valid > 0 && !is_buyin) {
    candle_queue = []; // ask: clearing channel? oh, clearing everything
    runningMin = 0;
    runningMax = 0;
    // Min = [];
    // MovingTR = [];
    is_buyin = true;
    massBuy(coins, i, "trueRange / valid / something ...");
    return;
  } else if (candle.close >= runningMax && is_buyin) {
    candle_queue = [];
    runningMin = 0;
    runningMax = 0;
    // Min = [];
    // MovingTR = [];
    is_buyin = false;
    massSell(coins, i, "candle.close >= runningMax");
    return;
  }
  if (NoTradedSince > 2 && !is_buyin) {
    candle_queue = [];
    runningMin = 0;
    // Min = [];
    runningMax = 0;
    // MovingTR = [];
    NoTradedSince = 0;
  }
  NoTradedSince++;
};
