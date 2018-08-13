import { Advice, AdviceObj, Candle, Portfolio } from "../types";
import { config } from "./config";

const calcConfig = config.paperTrader;
const watchConfig = config.watch;

class PaperTrader {
  rawFee: number; // maker or taker
  fee: number; // 0.0025 => makes no sense
  currency: string;
  asset: string;
  portfolio: Portfolio;
  balance?: number;
  exposed: boolean;
  propogatedTrades: number;
  trades: number;
  price: number; // current candle.close
  tradeId: string;

  constructor() {
    if (calcConfig.feeUsing === "maker") {
      this.rawFee = calcConfig.feeMaker;
    } else {
      this.rawFee = calcConfig.feeTaker;
    }

    this.fee = 1 - this.rawFee / 100;

    this.currency = watchConfig.currency;
    this.asset = watchConfig.asset;

    this.portfolio = {
      asset: calcConfig.simulationBalance.asset,
      currency: calcConfig.simulationBalance.currency
    };

    this.balance = null;

    if (this.portfolio.asset > 0) {
      this.exposed = true;
    }

    this.propogatedTrades = 0;
    this.trades = 0;
  }

  // TODO:
  // PerformanceAnalyzer.prototype.processPortfolioChange = function(event) {
  //   if(!this.start.portfolio) {
  //     this.start.portfolio = event;
  //   }
  // }
  relayPortfolioChange = () => {
    // this.deferredEmit("portfolioChange", {
    //   asset: this.portfolio.asset,
    //   currency: this.portfolio.currency
    // });
  };

  // TODO:
  // 1 very real subscriber
  // PerformanceAnalyzer.prototype.processPortfolioValueChange = function(event) {
  // if(!this.start.balance) {
  // this.start.balance = event.balance;
  // }
  relayPortfolioValueChange = () => {
    // this.deferredEmit("portfolioValueChange", {
    // balance: this.getBalance()
    // });
  };

  extractFee = (amount: number) => {
    amount *= 1e8;
    amount *= this.fee;
    amount = Math.floor(amount);
    amount /= 1e8;
    return amount;
  };

  setStartBalance = () => {
    this.balance = this.getBalance();
  };

  // after every succesfull trend ride we hopefully end up
  // with more BTC than we started with, this function
  // calculates Gekko's profit in %.
  updatePosition = (advice: AdviceObj) => {
    let what = advice.recommendation;

    let cost;
    let amount;

    // virtually trade all {currency} to {asset}
    // at the current price (minus fees)
    if (what === "long") {
      cost = (1 - this.fee) * this.portfolio.currency;
      this.portfolio.asset += this.extractFee(
        this.portfolio.currency / this.price
      );
      amount = this.portfolio.asset;
      this.portfolio.currency = 0;

      this.exposed = true;
      this.trades++;
    }

    // virtually trade all {currency} to {asset}
    // at the current price (minus fees)
    else if (what === "short") {
      cost = (1 - this.fee) * (this.portfolio.asset * this.price);
      this.portfolio.currency += this.extractFee(
        this.portfolio.asset * this.price
      );
      amount = this.portfolio.currency / this.price;
      this.portfolio.asset = 0;

      this.exposed = false;
      this.trades++;
    }

    const effectivePrice = this.price * this.fee;

    return { cost, amount, effectivePrice };
  };

  getBalance = () => {
    return this.portfolio.currency + this.price * this.portfolio.asset;
  };

  processAdvice = (advice: AdviceObj) => {
    let action;
    if (advice.recommendation === "short") action = "sell";
    else if (advice.recommendation === "long") action = "buy";
    else return;

    // for tradeInitiated only real subscriber was telegrambot
    this.tradeId = `trade-${++this.propogatedTrades}`;

    const { cost, amount, effectivePrice } = this.updatePosition(advice);

    this.relayPortfolioChange();
    this.relayPortfolioValueChange();

    // for tradeCompleted no real subscribers
  };

  processCandle = (candle: Candle) => {
    this.price = candle.close;

    if (!this.balance) {
      this.setStartBalance();
      this.relayPortfolioChange();
      this.relayPortfolioValueChange();
    }

    if (this.exposed) {
      this.relayPortfolioValueChange();
    }
  };
}
