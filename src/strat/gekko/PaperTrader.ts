import { Advice, AdviceObj, Candle, Portfolio, Trade } from "../types";
import { config } from "./config";
import { PerformanceAnalyzer } from "./PerformanceAnalyzer";

const calcConfig = config.paperTrader;
const watchConfig = config.watch;

export class PaperTrader {
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
  performanceAnalyzer: PerformanceAnalyzer;
  advice?: Advice; // current

  constructor(candle: Candle) {
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

    this.price = candle.close;
    this.balance = this.getBalance();

    if (this.portfolio.asset > 0) {
      this.exposed = true;
    }

    this.propogatedTrades = 0;
    this.trades = 0;

    this.performanceAnalyzer = new PerformanceAnalyzer(
      this.balance,
      this.portfolio
    );

    this.advice = null;
  }

  private extractFee = (amount: number) => {
    amount *= 1e8;
    amount *= this.fee;
    amount = Math.floor(amount);
    amount /= 1e8;
    return amount;
  };

  // after every succesfull trend ride we hopefully end up
  // with more BTC than we started with, this function
  // calculates Gekko's profit in %.
  private updatePosition = (advice: AdviceObj) => {
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

  private getBalance = () => {
    return this.portfolio.currency + this.price * this.portfolio.asset;
  };

  // ask: my custom, just forward candle to PerformanceAnalyzer
  processCandle = (candle: Candle) => {
    this.performanceAnalyzer.processCandle(candle);
  };

  processAdvice = (advice: AdviceObj, candle: Candle) => {
    this.price = candle.close;

    // ask: let`s check here I think this is the best place, can't find whre it happens in gekko, so many places to look
    if (this.advice === advice.recommendation) {
      return;
    }

    let action;
    if (advice.recommendation === "short") action = "sell";
    else if (advice.recommendation === "long") action = "buy";
    else return;

    // for tradeInitiated only real subscriber was telegrambot
    this.tradeId = `trade-${++this.propogatedTrades}`;

    const { cost, amount, effectivePrice } = this.updatePosition(advice);

    this.performanceAnalyzer.processTradeCompleted({
      id: this.tradeId,
      adviceId: advice.id,
      action,
      cost,
      amount,
      price: this.price,
      portfolio: this.portfolio,
      balance: this.getBalance(),
      date: advice.date,
      effectivePrice,
      feePercent: this.rawFee,
      candle
    } as Trade);

    this.advice = advice.recommendation;
  };
}
