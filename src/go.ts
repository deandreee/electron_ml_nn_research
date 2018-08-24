import { run } from "./strat/index";
const res = run();

console.log(
  "BTC",
  res.coins.BTC.trader.performanceAnalyzer.report.relativeProfit
);

// import * as telegram from "./strat/telegram";
// telegram.exec();
