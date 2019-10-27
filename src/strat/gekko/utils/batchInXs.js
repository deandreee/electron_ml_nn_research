const CandleBatcher2 = require("./CandleBatcher2");

const batchCandlesInXs = (candles, batchSize) => {
  const batcher = new CandleBatcher2(batchSize);
  const bigCandles = [];

  for (let i = 0; i < candles.length; i++) {
    batcher.write(candles[i]);

    // ask: could add partial last, but gekko removes it, so let's just keep like that
    if ((i + 1) % batchSize === 0) {
      const bigCandle = batcher.check();
      bigCandles.push(bigCandle);
    }
  }

  return bigCandles;
};

const batchIndInXs = (extra, batchSize) => {
  const extraBatched = {};
  Object.keys(extra).map(x => {
    const res = [];
    for (let i = 0; i < extra[x].length; i += batchSize) {
      res.push(extra[x][i]);
    }
    extraBatched[x] = res;
  });

  return extraBatched;
};

module.exports = {
  batchCandlesInXs,
  batchIndInXs,
};
