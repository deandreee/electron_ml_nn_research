// // required indicators
// import { MFI as MFI_ } from "technicalindicators";
// import { Candle } from "../../types";

// export class MFI {
//   period: number;
//   mfi: MFI_;
//   result: number;

//   constructor(period: number) {
//     this.period = period;
//     this.mfi = new MFI_({ high: [], low: [], close: [], volume: [], period });
//   }

//   update(candle: Candle) {
//     this.result = this.mfi.nextValue({
//       close: candle.close,
//       high: candle.high,
//       low: candle.low,
//       volume: candle.volume
//     });
//     return this.result;
//   }
// }

export const MFI = {};
