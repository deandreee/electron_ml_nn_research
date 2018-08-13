import * as moment from "moment";
import { Moment } from "moment";
import * as statslite from "stats-lite";
import { config } from "./config";
import { Portfolio, Candle } from "../types";
import * as ms from "ms";

const perfConfig = config.performanceAnalyzer;
const watchConfig = config.watch;

const Logger = require("./logger");

interface RoundTripAction {
  date: Date;
  price: number;
  total: number;
}

interface RoundTrip {
  id: number;

  entryAt?: Date;
  entryPrice?: number;
  entryBalance?: number;

  exitAt?: Date; // TODO: izmantojas vsp?
  exitPrice?: number;
  exitBalance?: number;

  duration?: number;

  pnl?: number;
  profit?: number;

  exit?: RoundTripAction;
  entry?: RoundTripAction;
}

interface Start {
  balance?: number;
  portfolio?: Portfolio;
}

interface Trade {
  action: "buy" | "sell";
  date: Date;
  price: number;
  portfolio: Portfolio;
  balance: number;
}

class PerformanceAnalyzer {
  dates: {
    start?: Date;
    end?: Date;
  };
  startPrice: number;
  endPrice: number;
  currency: string;
  asset: string;
  trades: number;
  exposure: number;
  roundTrips: RoundTrip[];
  losses: RoundTrip[];
  roundTrip: RoundTrip;
  portfolio: Portfolio;
  balance: number;
  start: Start;
  openRoundTrip: boolean;
  price: number;

  constructor() {
    this.dates = {
      start: null,
      end: null
    };

    this.startPrice = 0;
    this.endPrice = 0;

    this.currency = watchConfig.currency;
    this.asset = watchConfig.asset;

    this.trades = 0;

    this.exposure = 0;

    this.roundTrips = [];
    this.losses = [];
    this.roundTrip = {
      id: 0
    };

    // this.portfolio = {}; // TODO
    this.balance;

    this.start = {};
    this.openRoundTrip = false;
  }

  // TODO: remove
  //   processPortfolioValueChange = (event) => {
  //     if (!this.start.balance) {
  //       this.start.balance = event.balance;
  //     }
  //     }
  // processPortfolioChange = function(event) {
  //     if (!this.start.portfolio) {
  //       this.start.portfolio = event;
  //     }

  processCandle = (candle: Candle) => {
    this.price = candle.close;
    this.dates.end = new Date(candle.start * 1000 + ms("1min"));

    if (!this.dates.start) {
      this.dates.start = new Date(candle.start * 1000);
      this.startPrice = candle.close;
    }

    this.endPrice = candle.close;
  };

  processTradeCompleted = (trade: Trade) => {
    this.trades++;
    this.portfolio = trade.portfolio;
    this.balance = trade.balance;

    this.registerRoundtripPart(trade);

    const report = this.calculateReportStatistics();
    // TODO: put somewhere for logging?
  };

  registerRoundtripPart = (trade: Trade) => {
    if (this.trades === 1 && trade.action === "sell") {
      // this is not part of a valid roundtrip
      return;
    }

    if (trade.action === "buy") {
      if (this.roundTrip.exit) {
        this.roundTrip.id++;
        this.roundTrip.exit = null;
      }

      this.roundTrip.entry = {
        date: trade.date,
        price: trade.price,
        total: trade.portfolio.currency + trade.portfolio.asset * trade.price
      };
      this.openRoundTrip = true;
    } else if (trade.action === "sell") {
      this.roundTrip.exit = {
        date: trade.date,
        price: trade.price,
        total: trade.portfolio.currency + trade.portfolio.asset * trade.price
      };
      this.openRoundTrip = false;

      this.handleCompletedRoundtrip();
    }
  };

  handleCompletedRoundtrip = () => {
    let roundtrip: RoundTrip = {
      id: this.roundTrip.id,

      entryAt: this.roundTrip.entry.date,
      entryPrice: this.roundTrip.entry.price,
      entryBalance: this.roundTrip.entry.total,

      exitAt: this.roundTrip.exit.date,
      exitPrice: this.roundTrip.exit.price,
      exitBalance: this.roundTrip.exit.total,

      duration:
        this.roundTrip.exit.date.getTime() - this.roundTrip.entry.date.getTime()
    };

    roundtrip.pnl = roundtrip.exitBalance - roundtrip.entryBalance;
    roundtrip.profit =
      (100 * roundtrip.exitBalance) / roundtrip.entryBalance - 100;

    this.roundTrips[this.roundTrip.id] = roundtrip;

    // this.deferredEmit("roundtrip", roundtrip); // not sure if needed

    // update cached exposure
    this.exposure =
      this.exposure +
      this.roundTrip.exit.date.getTime() -
      this.roundTrip.entry.date.getTime();

    // track losses separately for downside report
    if (roundtrip.exitBalance < roundtrip.entryBalance) {
      this.losses.push(roundtrip);
    }
  };

  calculateReportStatistics = () => {
    if (!this.start.balance || !this.start.portfolio) {
      throw new Error(
        "Cannot calculate a profit report without having received portfolio data."
      );
    }

    // the portfolio's balance is measured in {currency}
    const profit = this.balance - this.start.balance;

    const timespan = moment.duration(
      this.dates.end.getTime() - this.dates.start.getTime()
    );
    const relativeProfit = (this.balance / this.start.balance) * 100 - 100;
    const relativeYearlyProfit = relativeProfit / timespan.asYears();

    const percentExposure =
      this.exposure / (this.dates.end.getTime() - this.dates.start.getTime());

    const sharpe =
      (relativeYearlyProfit - perfConfig.riskFreeReturn) /
      statslite.stdev(this.roundTrips.map(r => r.profit)) /
      Math.sqrt(this.trades / (this.trades - 2));

    const downside =
      statslite.percentile(this.losses.map(r => r.profit), 0.25) *
      Math.sqrt(this.trades / (this.trades - 2));

    const market = (this.endPrice * 100) / this.startPrice - 100;

    const report = {
      startTime: this.dates.start, // .utc().format("YYYY-MM-DD HH:mm:ss"),
      endTime: this.dates.end, // .utc().format("YYYY-MM-DD HH:mm:ss"),
      timespan: timespan.humanize(),
      market,

      balance: this.balance,
      profit,
      relativeProfit: relativeProfit,

      yearlyProfit: profit / timespan.asYears(),
      relativeYearlyProfit,

      startPrice: this.startPrice,
      endPrice: this.endPrice,
      trades: this.trades,
      startBalance: this.start.balance,
      exposure: percentExposure,
      sharpe,
      downside,
      alpha: profit - market
    };

    return report;
  };

  finalize = () => {
    const report = this.calculateReportStatistics();
  };
}
