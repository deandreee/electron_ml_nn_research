import { run } from "./strat/index";
import { config } from "./strat/config";
const res = run();

console.log(
  config.leadCoin,
  res.coins[config.leadCoin].trader.performanceAnalyzer.report.relativeProfit
);

// import * as telegram from "./strat/telegram";
// telegram.exec();
