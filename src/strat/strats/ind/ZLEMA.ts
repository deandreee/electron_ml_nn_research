// import { EMA } from "technicalindicators";
// import { times } from "lodash";
// import { Candle } from "../../types";
// // import { WaveManager } from "../utils/WaveManager";

// export class ZLEMA {
//   period: number;
//   candleHistory: Candle[];

//   constructor(period: number) {
//     this.period = period;
//     this.candleHistory = [];
//   }

//   update = (candle: Candle) => {
//     this.candleHistory.push(candle);
//     const lag = Math.floor((this.period - 1) / 2);
//     const data = this.candleHistory.slice(-this.period);
//     const dataMinusLag = this.candleHistory.slice(-this.period + lag);
//     const val = EMA.calculate({
//       period: this.period,
//       values: [...data, ...dataMinusLag].map(x => x.close)
//     });
//     return val.slice(-1)[0];
//   };
// }

export const ZLEMA = {};
