// @ts-ignore
import { run } from "./strat/index";
// import { config } from "./strat/config";
// @ts-ignore
import { marketMonth } from "./strat/marketMonth";

try {
  run();
  // marketMonth();
} catch (err) {
  console.error(err);
}

// console.log(
//   config.leadCoin,
//   res.coins[config.leadCoin].trader.performanceAnalyzer.report.relativeProfit
// );

// import * as telegram from "./strat/telegram";
// telegram.exec();
