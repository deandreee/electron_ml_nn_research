import * as ms from "ms";
import { sumBy, padEnd } from "lodash";

import { queryCoin } from "../strat/queryCoins";
import * as dataranges from "../strat/daterange";
import { Coins } from "../strat/types";
// import { doubleBarrier } from "../strat/corr/barrier";
import { trippleBarrier } from "../strat/corr/barrier";
import { binaryBarrierUp } from "../strat/corr/barrier";
import { binaryBarrierDown } from "../strat/corr/barrier";
// import { getTrippleBarrierConfig } from "../strat/corr/barrier";
import { runConfig } from "../strat/run/runConfig";
import { batchCandlesInXs } from "../strat/db/batchCandlesInXs";

export const barrierLabels = () => {
  const range = dataranges.JJASON;
  const fromExtended = new Date(range.from);
  const toExtended = new Date(range.to.getTime() + ms("30d"));
  const coin = queryCoin(Coins.BTC, fromExtended, toExtended);
  const candles = batchCandlesInXs(coin.candles, runConfig.BATCH.batchSize);

  // const tbCfg = getTrippleBarrierConfig(runConfig, runConfig.BARRIER_LABEL);
  const tbCfg = { stopLoss: -5, takeProfit: 5, lookAhead: 250 }; // 250 was best

  for (let i = 0; i < candles.length; i++) {
    // console.log(i);
    const candle = candles[i];

    if (new Date(candle.start * 1000) > range.to) {
      break;
    }

    candle.pctChange = {
      //   double: doubleBarrier(candles, i, tbCfg),
      tripple: trippleBarrier(candles, i, tbCfg),
      up: binaryBarrierUp(candles, i, tbCfg),
      down: binaryBarrierDown(candles, i, tbCfg)
    };
  }

  const candlesActual = candles.filter(x => x.start < range.to.getTime() / 1000);

  console.log("start", new Date(candlesActual[0].start * 1000).toISOString());
  console.log("end", new Date(candlesActual[candlesActual.length - 1].start * 1000).toISOString());
  console.log("end/extended", new Date(candles[candles.length - 1].start * 1000).toISOString());

  console.log("candles.length", candles.length);
  console.log("candlesActual.length", candlesActual.length);

  console.log(padEnd("UP: ", 10) + sumBy(candlesActual, x => (x.pctChange.up === 1 ? 1 : 0)));
  console.log(padEnd("NOT UP: ", 10) + sumBy(candlesActual, x => (x.pctChange.up === 0 ? 1 : 0)));

  console.log(padEnd("DOWN: ", 10) + sumBy(candlesActual, x => (x.pctChange.down === 1 ? 1 : 0)));
  console.log(padEnd("NOT DOWN: ", 10) + sumBy(candlesActual, x => (x.pctChange.down === 0 ? 1 : 0)));
};
