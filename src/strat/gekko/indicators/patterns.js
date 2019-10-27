// const hasHeadAndShoulder = require("technicalindicators").hasHeadAndShoulder;
// const hasDoubleBottom = require("technicalindicators").hasDoubleBottom;
// const hasDoubleTop = require("technicalindicators").hasDoubleTop;
// // const trendingUp = require("technicalindicators").trendingUp;
// // const trendingDown = require("technicalindicators").trendingDown;
// const threeblackcrows = require("technicalindicators").threeblackcrows;
// const IndBaseAsync = require("./IndBaseAsync");

// class Patterns extends IndBaseAsync {
//   constructor(period, props) {
//     super(props);
//     this.input = "candle";
//     this.period = period;
//     this.candles = [];
//   }

//   enqueueClose(price) {
//     let queue = this.candles;
//     if (queue.length >= this.period) {
//       queue.shift();
//     }

//     queue.push(price);
//   }

//   async updateCore(candle) {
//     this.enqueueClose(candle);

//     if (this.candles.length < this.period) {
//       this.result = null;
//       return null;
//     }

//     const inputFull = {
//       open: this.candles.map(x => x.open),
//       high: this.candles.map(x => x.high),
//       close: this.candles.map(x => x.close),
//       low: this.candles.map(x => x.low),
//     };

//     const inputCloses = {
//       values: this.candles.map(x => x.close),
//     };

//     // this.result = hasHeadAndShoulder({ values: this.closes });
//     this.result = {
//       db: (await hasDoubleBottom(inputCloses)) ? 1 : 0,
//       dt: (await hasDoubleTop(inputCloses)) ? 1 : 0,
//       hs: (await hasHeadAndShoulder(inputCloses)) ? 1 : 0,
//       tbc: threeblackcrows(inputFull) ? 1 : 0,
//       // tu: (await trendingUp({ values: this.closes })) ? 1 : 0,
//       // td: (await trendingDown({ values: this.closes })) ? 1 : 0,
//     };

//     return this.result;
//   }
// }

// module.exports = Patterns;

// disabled to avoid TF import error
module.exports = {};
