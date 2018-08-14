import { CoinList } from "./types";
import { vol1 } from "./vol1";
import * as ms from "ms";
import { queryCoins } from "./queryCoins";

let buyAt: Date = null;

// wow both down and up
// const from = new Date("2018-05-24T00:00:00.000Z");
// const to = new Date("2018-05-25T00:00:00.000Z");
// 15:47

// pump weird small drops in a day, then shoots up straight up in 3m
const from = new Date("2018-06-02T00:00:00.000Z");
const to = new Date("2018-06-10T00:00:00.000Z");

// dump
// const from = new Date("2018-06-10T00:00:00.000Z");
// const from = new Date("2018-06-09T22:00:00.000Z"); // actually starts around 17:00
// const to = new Date("2018-06-10T12:00:00.000Z");

// very gradual, first signs around 07:36
// const buyAt = new Date("2018-07-24T07:36:00.000Z");
// const buyAt = new Date("2018-07-24T04:00:00.000Z");
// const from = new Date("2018-07-24T00:00:00.000Z");
// const to = new Date("2018-07-25T00:00:00.000Z");

// const buyAt = new Date("2018-07-29T04:00:00.000Z");
// const from = new Date("2018-07-25T00:00:00.000Z");
// const to = new Date("2018-07-26T00:00:00.000Z");

const fromExtended = new Date(from.getTime() - ms("1h"));
const toExtended = new Date(to.getTime() + ms("1h"));

interface Result {
  coins: CoinList;
  labelsPredicted: number[];
}

export const run = (): Result => {
  const coins = queryCoins(fromExtended, toExtended);
  vol1(coins, buyAt);

  // const svm = new SVM.SVM();
  // const candlesActual = coins.BTC.candles.filter(
  //   x => x.start * 1000 >= from.getTime() && x.start * 1000 <= to.getTime()
  // );
  // const data = candlesActual.map(x => x.features);
  // const labels = candlesActual.map(x => x.label);
  // svm.train(data, labels);

  // const labelsPredicted = svm.predict(data);
  const labelsPredicted: number[] = [];

  return { coins, labelsPredicted };

  //   let str = await bluebird.fromCallback((cb: Cb) => csv.stringify(csvRows, cb));
  //   await bluebird.fromCallback((cb: Cb) => fs.appendFile(fileName, str, cb));
  //   console.log("csv.stringify done");
};
