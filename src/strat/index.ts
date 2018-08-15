import { Candle, CoinList } from "./types";
import { vol1 } from "./vol1";
import * as ms from "ms";
import { queryCoins } from "./queryCoinsBtc";
import { rescaleForSvm } from "./rescale";
import * as pumps from "./pumps";
const SVM = require("libsvm-js/asm");

let buyAt: Date = null;

// const buyAt = new Date("2018-07-29T04:00:00.000Z");
// const from = new Date("2018-07-25T00:00:00.000Z");
// const to = new Date("2018-07-26T00:00:00.000Z");

// const from = new Date("2018-07-01T00:00:00.000Z");
// const to = new Date("2018-08-01T00:00:00.000Z");

const { from, to } = pumps.jun2;

// const from = new Date("2018-07-24T00:00:00.000Z");
// const to = new Date("2018-07-25T00:00:00.000Z");

const fromExtended = new Date(from.getTime() - ms("1h"));
const toExtended = new Date(to.getTime() + ms("1h"));

interface Result {
  coins: CoinList;
  labelsPredicted: number[];
}

export const run = (): Result => {
  const coins = queryCoins(fromExtended, toExtended);
  vol1(coins, buyAt);

  // const svm = new SVM();
  const candlesActual = coins.BTC.candles.filter(
    x => x.start * 1000 >= from.getTime() && x.start * 1000 <= to.getTime()
  );
  // const data = candlesActual.map(x => x.features);
  // const labels = candlesActual.map(x => x.label);
  // const data = [[0, 0], [0, 1], [1, 0], [1, 1]];
  // const labels = [-1, 1, 1, -1];
  // svm.train(data, labels, { C: 1 });
  // svm.train(data, labels, { kernel: "rbf", rbfsigma: 0.5 }); // sigma in the gaussian kernel = 0.5

  // const data = [[1, 2], [5, 8], [1.5, 1.8], [8, 8], [1, 0.6], [9, 11]];
  // const labels = [0, 1, 0, 1, 0, 1];
  // const input = data.map((x, i) => [x, labels[i]]);
  // svm.train(input).done(() => {
  //   console.log(svm.predictSync(data[0]));
  // });

  const labelsPredicted = predictSvm(candlesActual);
  // const labelsPredicted = svm.predictOne([1, 2]);
  // const labelsPredicted: number[] = [];

  return { coins, labelsPredicted };

  //   let str = await bluebird.fromCallback((cb: Cb) => csv.stringify(csvRows, cb));
  //   await bluebird.fromCallback((cb: Cb) => fs.appendFile(fileName, str, cb));
  //   console.log("csv.stringify done");
};

const predictSvm = (candlesActual: Candle[]): number[] => {
  const svm = new SVM({
    kernel: SVM.KERNEL_TYPES.RBF, // The type of kernel I want to use
    type: SVM.SVM_TYPES.C_SVC, // The type of SVM I want to run
    gamma: 1, // RBF kernel gamma parameter
    cost: 1 // C_SVC cost parameter
  });

  const features2d = candlesActual.map(x => x.features);
  const features1d = features2d.map(x => x[0]);
  const data1d = rescaleForSvm(features1d);
  const data2d = data1d.map(x => [x]);
  const labels = candlesActual.map(x => x.label);

  svm.train(data2d, labels, { C: 1 });
  const predicted = svm.predict(data2d);
  console.log("predicted", predicted);
  return predicted;
};

// const go = () => {
//   const svm = new SVM({
//     kernel: SVM.KERNEL_TYPES.LINEAR, // The type of kernel I want to use
//     type: SVM.SVM_TYPES.C_SVC, // The type of SVM I want to run
//     gamma: 1, // RBF kernel gamma parameter
//     cost: 1 // C_SVC cost parameter
//   });
//   const data = [[1, 2], [5, 8], [1.5, 1.8], [8, 8], [1, 0.6], [9, 11]];
//   const labels = [0, 1, 0, 1, 0, 1];
//   svm.train(data, labels, { C: 1 });

//   svm.predict(data);
// };
