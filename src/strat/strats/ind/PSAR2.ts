// // anandanand84/technicalindicators lib wrapper
// // @link http://en.wikipedia.org/wiki/Exponential_moving_average#Exponential_moving_average
// import { PSAR } from "technicalindicators";
// import { Candle } from "../../types";

// let step = 0.025;
// let max = 0.05;

// export class PSAR2 {
//   psar: PSAR;
//   constructor() {
//     this.psar = new PSAR({
//       step,
//       max,
//       high: [],
//       low: []
//     });
//   }

//   update = (candle: Candle): number => {
//     // @ts-ignore
//     const res = this.psar.nextValue({
//       step,
//       max,
//       low: candle.low,
//       high: candle.high
//     });

//     // this is so so bad, that lib doesn't even have it's typings right

//     const ret = Array.isArray(res) ? (res as number[])[0] : res;
//     return res;
//   };
// }

export const PSAR2 = {};
